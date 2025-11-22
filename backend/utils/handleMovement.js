// // utils/handleMovement.js
// import Movement from '../models/Movements.js';
// import Inventory from '../models/Inventory.js';
// import Product from '../models/Products.js';
// import Alert from '../models/Alerts.js';

// export const handleMovement = async ({
//   type,
//   product,
//   quantity,
//   fromWarehouse,
//   toWarehouse,
//   initiatedBy,
//   session
// }) => {
//   const movement = new Movement({
//     type,
//     product,
//     quantity,
//     fromWarehouse,
//     toWarehouse,
//     status: 'completed',
//     initiatedBy
//   });

//   await movement.save({ session });

//   // Inventory update
//   switch (type) {
//     case 'adjustment':
//     case 'purchase':
//       await Inventory.updateOne(
//         { product, warehouse: toWarehouse },
//         { $inc: { quantity } },
//         { session, upsert: true }
//       );
//       break;

//     case 'sale':
//       await Inventory.updateOne(
//         { product, warehouse: fromWarehouse },
//         { $inc: { quantity: -quantity } },
//         { session }
//       );
//       break;

//     case 'transfer':
//       await Promise.all([
//         Inventory.updateOne(
//           { product, warehouse: fromWarehouse },
//           { $inc: { quantity: -quantity } },
//           { session }
//         ),
//         Inventory.updateOne(
//           { product, warehouse: toWarehouse },
//           { $inc: { quantity: quantity } },
//           { session, upsert: true }
//         )
//       ]);
//       break;
//   }

//   // Low-stock check (only for sale or transfer from)
//   const affectedWarehouse = type === 'sale' || type === 'transfer' ? fromWarehouse : null;
//   if (affectedWarehouse) {
//     const updatedInventory = await Inventory.findOne({ product, warehouse: affectedWarehouse });
//     const productInfo = await Product.findById(product);

//     if (updatedInventory.quantity < (productInfo.minStockLevel || 0)) {
//       await Alert.create([{
//         type: 'low-stock',
//         product,
//         warehouse: affectedWarehouse,
//         threshold: productInfo.minStockLevel,
//         currentValue: updatedInventory.quantity,
//         severity: 'high', // You can scale this based on how low it is
//         status: 'active'
//       }], { session });
//     }
//   }

//   return movement;
// };
