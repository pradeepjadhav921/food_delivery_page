export const send_order_to_hotel = (
  hotel_name,
  section = "online_order",
  table_no,
  note,
  cartItems,
  isProcessing,
  setIsProcessing,
  role = 'captain'
) => {
  return new Promise((resolve, reject) => {
    // Validate inputs
    if (!cartItems || cartItems.length === 0) {
      const error = new Error("Cart is empty. Cannot send an empty order.");
      console.warn(error.message);
      return reject(error);
    }

    if (!hotel_name) {
      const error = new Error("Hotel name is required");
      console.warn(error.message);
      return reject(error);
    }

    // Process order items (expand by quantity)
    const processedOrderItems = cartItems.flatMap(item => {
      const { quantity, ...itemWithoutQuantity } = item;
      return Array(quantity).fill().map(() => ({
        ...itemWithoutQuantity,
        portion: "Full"
      }));
    });

    const orderData = {
      hotel_name,
      section,
      table: table_no,
      note,
      order_items: processedOrderItems,
      orderid: Date.now(),
    };

    console.log("Order payload:", orderData);

    // WebSocket management
    let orderSocket;
    let isComplete = false;

    const cleanup = () => {
      if (isComplete) return;
      isComplete = true;
      
      if (orderSocket) {
        console.log("Closing order socket",orderSocket);
        orderSocket.close();
      }
      setIsProcessing(false);
    };

    // Order WebSocket
    orderSocket = new WebSocket(`wss://server1.nextorbitals.in/send?hotel_name=${hotel_name}&role=${role}`);

    orderSocket.onopen = () => {
      console.log('Order WebSocket connected, sending data...');
      orderSocket.send(JSON.stringify(orderData));
    };

    orderSocket.onmessage = async (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.status !== 'success') {
          throw new Error(response.message || 'Order failed');
        }

        console.log('Order placed successfully!');
        
        if (section === 'online_order') {
          console.log('Waiting for settlement update...');
          try {
            const settlementUpdate = await waitForSettlementUpdate(hotel_name, role);
            cleanup();
            resolve(settlementUpdate);
          } catch (e) {
            cleanup();
            reject(e);
          }
        } else {
          console.log('Skipping settlement update for non-online order');
          cleanup();
          resolve({action: "Accepted",hotel_name: hotel_name,id: 1,message: "Settle the table",section: section,tableNumber:table_no ,timestamp: 1755102744184});
        }
      } catch (error) {
        console.error('Order processing error:', error);
        cleanup();
        reject(error);
      }
    };

    orderSocket.onerror = (error) => {
      console.error('Order WebSocket error:', error);
      cleanup();
      reject(new Error('Order connection error'));
    };

    orderSocket.onclose = () => {
      if (!isComplete) {
        console.log('Order WebSocket closed unexpectedly');
        cleanup();
        reject(new Error('Order connection closed unexpectedly'));
      }
    };
  });
};

const waitForSettlementUpdate = (hotel_name, role) => {
  return new Promise((resolve, reject) => {
    const settlementWs = new WebSocket(`wss://server1.nextorbitals.in/settlement?hotel_name=${hotel_name}&role=${role}`);

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received settlement update:", data);
        settlementWs.removeEventListener('message', handleMessage);
        if (settlementWs) {
          console.log("Closing settlement socket",settlementWs);
          settlementWs.close();
        }
        resolve(data);
      } catch (e) {
        settlementWs.removeEventListener('message', handleMessage);
        settlementWs.close();
        reject(e);
      }
    };

    settlementWs.addEventListener('message', handleMessage);

    settlementWs.onerror = (error) => {
      settlementWs.removeEventListener('message', handleMessage);
      settlementWs.close();
      reject(error);
    };

    settlementWs.onclose = () => {
      settlementWs.removeEventListener('message', handleMessage);
      console.warn("Settlement WebSocket closed.");
    };
  });
};