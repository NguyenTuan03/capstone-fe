'use client';
import { extractFrames } from '@/@crema/utils/video';
import React, { useState } from 'react';
import * as geminiService from '@/@crema/services/apis/ai/geminiService';
import { CombinedAnalysisResult } from '@/@crema/types/models/AI';
const LearnerVideoAnalysis = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CombinedAnalysisResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setError(null);
    setResults([]);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(videoFile);
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });

      const middleTime = videoElement.duration / 2;
      URL.revokeObjectURL(videoElement.src);

      // Extract 5 frames around the middle of the video to capture the movement
      const timestamps = [
        middleTime - 0.2,
        middleTime - 0.1,
        middleTime,
        middleTime + 0.1,
        middleTime + 0.2,
      ].filter((t) => t > 0 && t < videoElement.duration);

      const frames = await extractFrames(videoFile, timestamps);
      const analysisResult = await geminiService.analyzeVideo(frames);

      setResults((prevResults) => [analysisResult, ...prevResults]);
      setVideoFile(null);
      setVideoUrl(null);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        if (err.message.includes('load video')) {
          setError('Lỗi khi tải video. Vui lòng đảm bảo đó là tệp video hợp lệ và thử lại.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🤖 Phân Tích Kỹ Thuật AI</h2>
          <p className="text-gray-600">Upload video của bạn để nhận phản hồi chi tiết từ AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📤</span>
                <span>Tải Video Lên</span>
              </h3>

              {!videoFile ? (
                <label
                  onDragEnter={(e) =>
                    handleDragEnter(e as unknown as React.DragEvent<HTMLDivElement>)
                  }
                  onDragLeave={(e) =>
                    handleDragLeave(e as unknown as React.DragEvent<HTMLDivElement>)
                  }
                  onDragOver={(e) =>
                    handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>)
                  }
                  onDrop={(e) => handleDrop(e as unknown as React.DragEvent<HTMLDivElement>)}
                  className={`flex flex-col items-center justify-center w-full h-80 border-2 ${
                    isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
                  } border-dashed rounded-2xl cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:bg-blue-50`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <svg
                      className="w-20 h-20 mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z"
                      />
                    </svg>
                    <p className="mb-2 text-xl font-bold text-gray-700">Tải Video Của Bạn</p>
                    <p className="text-gray-500 text-lg">hoặc kéo và thả vào đây</p>
                    <p className="text-sm text-gray-400 mt-4">MP4, MOV, AVI • Tối đa 50MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="bg-black bg-opacity-50 rounded-xl overflow-hidden border-4 border-green-400 shadow-xl">
                    <video controls src={videoUrl || ''} className="w-full" />
                  </div>
                  <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">✅</span>
                        <div>
                          <p className="font-bold text-green-800">Video đã tải lên</p>
                          <p className="text-sm text-green-600">{videoFile.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setVideoFile(null);
                          setVideoUrl(null);
                          setResults([]);
                        }}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!videoFile || isLoading}
                className="w-full mt-6 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-all font-bold text-lg shadow-lg disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? '⏳ Đang Phân Tích...' : '🔍 Phân Tích Video'}
              </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-blue-800 shadow-sm transform hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-xl font-bold mb-1">Nhanh Chóng</div>
                <div className="text-blue-600 text-sm">Kết quả trong vài giây</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-green-800 shadow-sm transform hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-xl font-bold mb-1">Chính Xác</div>
                <div className="text-green-600 text-sm">AI phân tích chi tiết</div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 min-h-[600px] shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>Phân Tích từ AI</span>
              </h3>

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-400"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
                      🤖
                    </div>
                  </div>
                  <p className="mt-6 text-gray-700 text-lg font-semibold">
                    AI đang phân tích video...
                  </p>
                  <p className="text-gray-500 text-sm mt-2">Vui lòng chờ trong giây lát</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-red-700 text-lg">{error}</p>
                </div>
              )}

              {results.length > 0 && !isLoading && (
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="space-y-4 bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      {/* Shot Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold text-lg shadow-sm">
                            {result.shotType}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            {(result.confidence * 100).toFixed(0)}% Chính xác
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {result.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Summary */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <h4 className="font-bold mb-2 flex items-center gap-2 text-blue-800">
                          <span>✨</span>
                          <span>Tóm Tắt</span>
                        </h4>
                        <p className="text-gray-700">{result.pose.summary}</p>
                      </div>

                      {/* Feedback */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <span>💬</span>
                          <span>Nhận Xét</span>
                        </h4>
                        <p className="text-gray-700">{result.pose.feedback}</p>
                      </div>

                      {/* Movement Analysis */}
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-4 text-lg">
                          🎯 Phân Tích Chuyển Động
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <div className="font-semibold text-green-800 mb-1">Chuẩn Bị</div>
                            <p className="text-sm text-gray-700">{result.movement.preparation}</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <div className="font-semibold text-blue-800 mb-1">Tiếp Xúc</div>
                            <p className="text-sm text-gray-700">{result.movement.contact}</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                            <div className="font-semibold text-purple-800 mb-1">Kết Thúc</div>
                            <p className="text-sm text-gray-700">{result.movement.followThrough}</p>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                        <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                          <span>💡</span>
                          <span>Gợi Ý Cải Thiện</span>
                        </h4>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700">
                              <span className="text-yellow-600 font-bold">→</span>
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Description */}
                      {result.description && (
                        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                          <p className="text-sm text-gray-700 italic">{result.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && !error && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-8xl mb-6">🎥</div>
                  <h4 className="text-2xl font-bold text-gray-700 mb-3">Sẵn Sàng Phân Tích</h4>
                  <p className="text-gray-500 text-center max-w-md">
                    Tải video lên và nhấn &quot;Phân tích Video&quot; để AI đánh giá kỹ thuật của
                    bạn
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerVideoAnalysis;
