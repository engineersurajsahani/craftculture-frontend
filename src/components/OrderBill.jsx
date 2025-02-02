import React, { useState } from "react";
import {
  PDFDownloadLink,
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  section: { margin: 10, padding: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", padding: 5 },
  bold: { fontWeight: "bold" },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 10,
  },
  address: { fontSize: 12, marginVertical: 10 },
  total: { fontSize: 16, marginTop: 20 },
});

const BillDocument = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Invoice</Text>

      <View style={styles.section}>
        <Text style={styles.bold}>Order Details:</Text>
        <Text>Order ID: {order._id}</Text>
        <Text>Date: {new Date(order.orderDate).toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Customer Details:</Text>
        <Text>{order.fullName}</Text>
        <Text style={styles.address}>
          {order.address.street},{"\n"}
          {order.address.city}, {order.address.state}
          {"\n"}
          {order.address.postalCode}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Items:</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text>
              {item.name} × {item.quantity}
            </Text>
            <Text>
              ₹
              {(
                item.price *
                (item.quantity || 1) *
                (1 - (item.offer || 0) / 100)
              ).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.total}>Total Amount:</Text>
          <Text style={styles.total}>₹{order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

const OrderBill = ({ order }) => {
  const [showModal, setShowModal] = useState(false);
  const fileName = `invoice-${order._id}.pdf`;

  return (
    <>
      <div className="d-flex gap-2">
        {/* View Bill Button */}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          View Bill
        </button>

        {/* Download Bill Button */}
        <PDFDownloadLink
          document={<BillDocument order={order} />}
          fileName={fileName}
          className="btn btn-success btn-sm"
        >
          {({ loading }) => (loading ? "Generating..." : "Download Bill")}
        </PDFDownloadLink>
      </div>

      {/* Bill View Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg p-4 w-11/12 max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-bold">Invoice</h5>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="h-[70vh]">
              <PDFViewer width="100%" height="100%">
                <BillDocument order={order} />
              </PDFViewer>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <PDFDownloadLink
                document={<BillDocument order={order} />}
                fileName={fileName}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                {({ loading }) => (loading ? "Generating..." : "Download")}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderBill;
