import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useNotification } from '../../context/NotificationContext';
import { Star, Calendar, MessageSquare, TrendingUp, User, Filter } from 'lucide-react';

const ProviderReviews = () => {
  const { addNotification } = useNotification();
  const [filter, setFilter] = useState('all');
  
  const [reviews] = useState([
    {
      id: 1,
      customer: 'John Smith',
      service: 'House Cleaning',
      rating: 5,
      date: '2024-01-20',
      review: 'Excellent service! The team was very professional and thorough. They cleaned every corner of my house and left it spotless. I especially appreciated their attention to detail in the bathroom and kitchen. Will definitely book again!',
      response: null,
      helpful: 12,
      verified: true,
      customerImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      service: 'Plumbing Repair',
      rating: 4,
      date: '2024-01-18',
      review: 'Quick response and professional service. The plumber arrived on time and fixed the issue efficiently. The only minor issue was that they had to come back the next day to complete the job, but they handled it well.',
      response: 'Thank you for your feedback! We apologize for the inconvenience of needing a second visit. We always strive to complete jobs in one visit, but sometimes unforeseen complications arise. We appreciate your understanding!',
      helpful: 8,
      verified: true,
      customerImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      customer: 'Mike Wilson',
      service: 'Garden Maintenance',
      rating: 5,
      date: '2024-01-15',
      review: 'Outstanding work on my garden! They transformed my overgrown yard into a beautiful, well-maintained space. The team was knowledgeable about different plants and gave me great advice for ongoing care. Highly recommend!',
      response: 'We\'re so happy to hear about your positive experience! Your garden was a pleasure to work on, and we\'re glad we could help transform your outdoor space. Thank you for trusting us with your landscaping needs.',
      helpful: 15,
      verified: true,
      customerImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 4,
      customer: 'Lisa Brown',
      service: 'Tutoring Session',
      rating: 5,
      date: '2024-01-10',
      review: 'Very helpful tutor who was patient with my learning pace. The session was well-structured and I learned a lot. The explanations were clear and easy to understand. Excellent teaching skills!',
      response: null,
      helpful: 5,
      verified: true,
      customerImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 5,
      customer: 'Emma Davis',
      service: 'Hair Styling',
      rating: 3,
      date: '2024-01-08',
      review: 'The service was okay, but not as expected. The stylist was friendly but the final result wasn\'t quite what I had in mind. The convenience of home service was nice though.',
      response: null,
      helpful: 3,
      verified: true,
      customerImage: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 6,
      customer: 'Robert Chen',
      service: 'House Cleaning',
      rating: 5,
      date: '2024-01-05',
      review: 'Amazing cleaning service! They were punctual, professional, and did an incredible job. My house has never looked better. The team was respectful of my property and very thorough in their work.',
      response: 'Thank you so much for your wonderful review! We take great pride in our work and it\'s always rewarding to hear when we\'ve exceeded expectations. We look forward to serving you again!',
      helpful: 10,
      verified: true,
      customerImage: 'https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ]);

  const [newResponse, setNewResponse] = useState('');
  const [respondingTo, setRespondingTo] = useState(null);

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'high') return review.rating >= 4;
    if (filter === 'low') return review.rating <= 3;
    if (filter === 'no-response') return !review.response;
    return false;
  });

  const handleRespondToReview = (reviewId) => {
    if (newResponse.trim()) {
      addNotification({
        type: 'success',
        title: 'Response Sent',
        message: 'Your response has been posted successfully'
      });
      
      setNewResponse('');
      setRespondingTo(null);
    }
  };

  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const responseRate = (reviews.filter(r => r.response).length / totalReviews * 100).toFixed(1);

  // Rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{totalReviews}</div>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{responseRate}%</div>
            <p className="text-sm text-gray-600">Response Rate</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {reviews.filter(r => r.rating >= 4).length}
            </div>
            <p className="text-sm text-gray-600">Positive Reviews</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(ratingDistribution[rating] / totalReviews) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filter by:</span>
            </div>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: `All (${reviews.length})` },
              { key: 'high', label: `High Ratings (${reviews.filter(r => r.rating >= 4).length})` },
              { key: 'low', label: `Low Ratings (${reviews.filter(r => r.rating <= 3).length})` },
              { key: 'no-response', label: `Need Response (${reviews.filter(r => !r.response).length})` }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === filterOption.key
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={review.customerImage}
                    alt={review.customer}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{review.customer}</h3>
                      {review.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{review.service}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.review}</p>
              </div>

              {/* Provider Response */}
              {review.response ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 mb-1">Your Response:</p>
                      <p className="text-green-800">{review.response}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  {respondingTo === review.id ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Write your response:
                      </label>
                      <textarea
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Thank you for your feedback..."
                      />
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleRespondToReview(review.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Post Response
                        </button>
                        <button
                          onClick={() => {
                            setRespondingTo(null);
                            setNewResponse('');
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondingTo(review.id)}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Respond to this review</span>
                    </button>
                  )}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{review.helpful} people found this helpful</span>
                </div>
                
                <div className="text-sm text-gray-500">
                  Review #{review.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You haven't received any reviews yet. Complete some services to start getting reviews!" 
                : "No reviews match the selected filter."}
            </p>
          </div>
        )}

        {/* Performance Insights */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Review Insights</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Most Mentioned Strengths</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Professional service</li>
                <li>• Attention to detail</li>
                <li>• Punctuality</li>
                <li>• Quality work</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recent Trends</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Rating improved by 0.2</li>
                <li>• 89% 5-star reviews</li>
                <li>• 95% customers would recommend</li>
                <li>• Response rate: {responseRate}%</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Action Items</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Respond to {reviews.filter(r => !r.response).length} pending reviews</li>
                <li>• Follow up on low ratings</li>
                <li>• Share positive reviews</li>
                <li>• Request more reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderReviews;