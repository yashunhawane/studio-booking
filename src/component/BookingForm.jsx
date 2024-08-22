import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const BookingForm = ({ onAddBooking, booking }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    booking_date: '',
    booking_time: {
      start: { time: '', period: 'AM' },
      end: { time: '', period: 'AM' }
    },
    price: '',
    status: 'Confirmed',
    mobile_number: ''
  });

  useEffect(() => {
    if (booking) {
      const startTime = booking.booking_time.start.split(' ');
      const endTime = booking.booking_time.end.split(' ');
      setFormData({
        customer_name: booking.customer_name,
        booking_date: booking.booking_date,
        booking_time: {
          start: {
            time: startTime[0],
            period: startTime[1] || 'AM'
          },
          end: {
            time: endTime[0],
            period: endTime[1] || 'AM'
          }
        },
        price: booking.price,
        status: booking.status,
        mobile_number: booking.mobile_number
      });
    } else {
      setFormData({
        customer_name: '',
        booking_date: '',
        booking_time: {
          start: { time: '', period: 'AM' },
          end: { time: '', period: 'AM' }
        },
        price: '',
        status: 'Confirmed',
        mobile_number: ''
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('booking_time')) {
      const [type, field] = name.split('_').slice(2);
      setFormData(prevData => ({
        ...prevData,
        booking_time: {
          ...prevData.booking_time,
          [type]: {
            ...prevData.booking_time[type],
            [field]: value
          }
        }
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatTime = (time, period) => `${time} ${period}`;

    try {
      const updatedData = {
        ...formData,
        booking_time: {
          start: formatTime(formData.booking_time.start.time, formData.booking_time.start.period),
          end: formatTime(formData.booking_time.end.time, formData.booking_time.end.period)
        }
      };

      if (booking) {
        const bookingRef = doc(db, "bookings", booking.booking_id);
        await updateDoc(bookingRef, updatedData);
      } else {
        const docRef = await addDoc(collection(db, "bookings"), updatedData);
        console.log("Booking added with ID: ", docRef.id);
      }

      onAddBooking(updatedData);
    } catch (error) {
      console.error("Error handling booking: ", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">{booking ? 'Edit Booking' : 'Add New Booking'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="customer_name">Customer Name</label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className="w-full border-gray-300 border rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="booking_date">Booking Date</label>
          <input
            type="date"
            id="booking_date"
            name="booking_date"
            value={formData.booking_date}
            onChange={handleChange}
            className="w-full border-gray-300 border rounded-lg p-2"
            required
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="booking_time_start_time">Booking Time Start</label>
            <input
              type="time"
              id="booking_time_start_time"
              name="booking_time_start_time"
              value={formData.booking_time.start.time}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="booking_time_start_period">AM/PM</label>
            <select
              id="booking_time_start_period"
              name="booking_time_start_period"
              value={formData.booking_time.start.period}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-2"
              required
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="booking_time_end_time">Booking Time End</label>
            <input
              type="time"
              id="booking_time_end_time"
              name="booking_time_end_time"
              value={formData.booking_time.end.time}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="booking_time_end_period">AM/PM</label>
            <select
              id="booking_time_end_period"
              name="booking_time_end_period"
              value={formData.booking_time.end.period}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-2"
              required
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border-gray-300 border rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="mobile_number">Mobile Number</label>
          <input
            type="tel"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            className="w-full border-gray-300 border rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border-gray-300 border rounded-lg p-2"
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {booking ? 'Update Booking' : 'Add Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
