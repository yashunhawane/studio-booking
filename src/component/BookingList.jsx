import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firebase configuration
import BookingForm from './BookingForm'; // Import the BookingForm component

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBooking, setEditBooking] = useState(null);

  // Fetch bookings from Firestore
  const fetchBookings = async () => {
    try {
      const bookingCollection = collection(db, "bookings");
      const bookingSnapshot = await getDocs(bookingCollection);
      const bookingList = bookingSnapshot.docs.map(doc => ({
        booking_id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingList);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    }
  };

  useEffect(() => {
    fetchBookings(); // Fetch bookings when the component is mounted
  }, []);

  const parseDateTime = (booking) => {
    return new Date(`${booking.booking_date} ${booking.booking_time.start}`);
  };

  const handleDelete = async (booking_id) => {
    try {
      // Delete the booking from Firestore
      await deleteDoc(doc(db, "bookings", booking_id));

      // Update the local state to remove the deleted booking
      setBookings(bookings.filter(booking => booking.booking_id !== booking_id));
    } catch (error) {
      console.error("Error deleting booking: ", error);
    }
  };

  const handleEdit = (booking) => {
    setEditBooking(booking);
    setShowForm(true);
  };

  const addBooking = (newBooking) => {
    if (editBooking) {
      setBookings(bookings.map(booking =>
        booking.booking_id === editBooking.booking_id ? { ...newBooking, booking_id: editBooking.booking_id } : booking
      ));
      setEditBooking(null);
    } else {
      setBookings([
        ...bookings,
        { ...newBooking, booking_id: `B${(bookings.length + 1).toString().padStart(3, '0')}` }
      ]);
    }
    setShowForm(false);
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const sortedBookings = bookings.sort((a, b) => parseDateTime(b) - parseDateTime(a));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Booking List</h1>
        <button
          className={`px-4 py-2 rounded ${showForm ? 'bg-red-500' : 'bg-green-500'} text-white hover:${showForm ? 'bg-red-600' : 'bg-green-600'}`}
          onClick={() => {
            setEditBooking(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : 'Add New Booking'}
        </button>
      </div>

      {showForm && <BookingForm onAddBooking={addBooking} booking={editBooking} />}

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings available.</p>
      ) : (
        <ul className="space-y-4">
          {sortedBookings.map((booking) => {
            const price = parseFloat(booking.price);
            return (
              <li key={booking.booking_id} className="border p-4 rounded-lg shadow-md bg-white">
                <p className="text-lg font-semibold text-gray-700">
                  <span className="font-bold">Customer Name:</span> {booking.customer_name}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Booking Date:</span> {booking.booking_date} ({getDayOfWeek(booking.booking_date)})
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Booking Time:</span> {booking.booking_time.start} - {booking.booking_time.end}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Price:</span> ${isNaN(price) ? 'N/A' : price.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Mobile Number:</span> {booking.mobile_number}
                </p>
                <p className={`text-sm font-semibold ${booking.status === "Confirmed" ? "text-green-600" : booking.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                  <span className="font-bold">Status:</span> {booking.status}
                </p>
                <div className="mt-4 flex space-x-2">
                  <button 
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(booking)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(booking.booking_id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BookingList;
