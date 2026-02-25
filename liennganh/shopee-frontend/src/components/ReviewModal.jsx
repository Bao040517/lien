import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, onSubmit, productName, productImage }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({ rating, comment });
        // Reset form
        setRating(5);
        setComment('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-[fadeIn_0.2s_ease-out] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800">Đánh Giá Sản Phẩm</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Product Info */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 border border-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-sm text-gray-700 font-medium line-clamp-2">{productName}</div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex flex-col items-center gap-2 mb-6">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                                            ? 'fill-primary-dark text-primary-dark'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="text-primary-darker font-medium text-sm">
                            {rating === 5 && 'Tuyệt vời'}
                            {rating === 4 && 'Hài lòng'}
                            {rating === 3 && 'Bình thường'}
                            {rating === 2 && 'Không hài lòng'}
                            {rating === 1 && 'Tệ'}
                        </div>
                    </div>

                    {/* Comment Input */}
                    <div className="mb-2">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ nhận xét của bạn về sản phẩm này..."
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-primary-dark focus:ring-1 focus:ring-primary-dark outline-none resize-none h-32"
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                    >
                        Trở lại
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!rating}
                        className="px-6 py-2 bg-primary-dark text-white text-sm font-medium rounded hover:bg-primary-darker transition disabled:opacity-50"
                    >
                        Hoàn thành
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
