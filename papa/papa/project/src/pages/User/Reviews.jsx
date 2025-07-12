// Updated React Reviews Page with Dynamic Fetching
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useNotification } from '../../context/NotificationContext';
import { Star, Calendar, MessageSquare, ThumbsUp, Flag, Edit3 } from 'lucide-react';
import axios from '../../axiosInstance';

const Reviews = () => {
  const { addNotification } = useNotification();
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/customer/reviews/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => setReviews(res.data))
      .catch(() => {
        addNotification({
          type: 'error',
          title: 'Error Fetching Reviews',
          message: 'Unable to load your reviews from server.',
        });
      });
  }, []);

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'high') return review.rating >= 4;
    if (filter === 'low') return review.rating <= 3;
    return false;
  });

  const handleEditReview = (reviewId) => {
    addNotification({
      type: 'info',
      title: 'Edit Review',
      message: 'Review editing feature will be available soon'
    });
  };

  const handleMarkHelpful = (reviewId) => {
    addNotification({
      type: 'success',
      title: 'Feedback Recorded',
      message: 'Thank you for marking this review as helpful'
    });
  };

  const handleReportReview = (reviewId) => {
    addNotification({
      type: 'info',
      title: 'Report Submitted',
      message: 'Thank you for reporting. We will review this content.'
    });
  };

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <DashboardLayout role="user">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold">My Reviews</h1>
            <p className="text-gray-600">Reviews you wrote for services</p>
          </div>
          <div className="flex items-center">
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
            <span className="ml-2 text-xl font-semibold text-gray-800">{avgRating}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex space-x-2">
          {['all', 'high', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              {f === 'all' ? 'All' : f === 'high' ? '4-5 Stars' : '1-3 Stars'}
            </button>
          ))}
        </div>

        {filteredReviews.length > 0 ? filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold">{review.booking?.service?.category?.name || 'Service'}</h2>
                <p className="text-sm text-gray-500">Provider: {review.booking?.provider?.firstName}</p>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`h-4 w-4 ${i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <div className="flex items-center justify-between border-t pt-2 text-sm text-gray-500">
              <button onClick={() => handleEditReview(review.id)} className="flex items-center space-x-1 hover:text-blue-600">
                <Edit3 className="h-4 w-4" /> <span>Edit</span>
              </button>
              <button onClick={() => handleMarkHelpful(review.id)} className="flex items-center space-x-1 hover:text-green-600">
                <ThumbsUp className="h-4 w-4" /> <span>Helpful</span>
              </button>
              <button onClick={() => handleReportReview(review.id)} className="flex items-center space-x-1 hover:text-red-600">
                <Flag className="h-4 w-4" /> <span>Report</span>
              </button>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" /> <span>{review.booking?.date || 'N/A'}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Reviews Yet</h3>
            <p className="text-gray-500">You haven't written any reviews or none match the selected filter.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reviews;
