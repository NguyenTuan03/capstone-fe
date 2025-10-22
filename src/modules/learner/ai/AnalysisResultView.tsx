import React from 'react';
import { CombinedAnalysisResult, VideoComparisonResult } from '@/@crema/types/models/AI';

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v3.882a1.5 1.5 0 0 0 .44 1.06l7.69 7.69a1.5 1.5 0 0 0 2.122 0l3.88-3.88a1.5 1.5 0 0 0 0-2.12L8.652 2.44A1.5 1.5 0 0 0 7.59 2H3.5ZM6 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
  </svg>
);

const ArrowUpCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v6.5l-3.47-3.47a.75.75 0 0 0-1.06 1.06l5 5a.75.75 0 0 0 1.06 0l5-5a.75.75 0 1 0-1.06-1.06L10.75 13.25v-6.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowDownCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-4.75a.75.75 0 0 0 1.5 0V8.5l3.47 3.47a.75.75 0 1 0 1.06-1.06l-5-5a.75.75 0 0 0-1.06 0l-5 5a.75.75 0 1 0 1.06 1.06L9.25 8.5v4.75Z"
      clipRule="evenodd"
    />
  </svg>
);

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 2a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 10 2ZM15.25 4.75a.75.75 0 0 0 1.06-1.06l-.88-.88a.75.75 0 0 0-1.06 1.06l.88.88ZM4.75 15.25a.75.75 0 0 0-1.06 1.06l.88.88a.75.75 0 1 0 1.06-1.06l-.88-.88ZM16.13 15.13a.75.75 0 0 1 0 1.06l-.88.88a.75.75 0 0 1-1.06-1.06l.88-.88a.75.75 0 0 1 1.06 0ZM2.75 10a.75.75 0 0 1 .75-.75h1.25a.75.75 0 0 1 0 1.5H3.5a.75.75 0 0 1-.75-.75Zm14.5 0a.75.75 0 0 1 .75-.75h1.25a.75.75 0 0 1 0 1.5h-1.25a.75.75 0 0 1-.75-.75ZM4.75 4.75a.75.75 0 0 1 0-1.06l.88-.88a.75.75 0 0 1 1.06 1.06l-.88.88a.75.75 0 0 1-1.06 0ZM15.13 4.87a.75.75 0 0 1 0-1.06l.88-.88a.75.75 0 0 1 1.06 1.06l-.88.88a.75.75 0 0 1-1.06 0ZM10 4a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75s.75-.336.75-.75v-.5A.75.75 0 0 0 10 4ZM8.5 7a4 4 0 0 0-3.93 3.91a.75.75 0 1 0 1.49.18A2.5 2.5 0 0 1 8.5 8.5a.75.75 0 0 0 0-1.5h-.002Z" />
    <path d="M7 14a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm.25-2.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z" />
  </svg>
);

const ScaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M10.243 2.25c.346 0 .66.182.834.475l.842 1.432 1.68.223c.373.05.69.293.81.646l.48 1.44a1.002 1.002 0 0 1-.165 1.033l-1.242 1.132.32 1.66c.075.39-.06.793-.362.998l-1.487.994.994 1.486c.205.303.24.707.098 1.042l-.48 1.44c-.12.353-.437.595-.81.646l-1.68.223-.842 1.432a1.002 1.002 0 0 1-.834.475H9.757a1.002 1.002 0 0 1-.834-.475l-.842-1.432-1.68-.223a1.002 1.002 0 0 1-.81-.646l-.48-1.44a1.002 1.002 0 0 1 .098-1.042l.994-1.486-1.487-.994a1.002 1.002 0 0 1-.362-1.00l.32-1.66-1.242-1.132a1.002 1.002 0 0 1-.165-1.033l.48-1.44c.12-.353.437-.596.81-.646l1.68-.223.842-1.432c.174-.293.488-.475.834-.475h.486Zm-3.18 6.03a.75.75 0 0 1 .843-.21l3.058 1.223a.75.75 0 0 1 .42 1.01l-1.223 3.058a.75.75 0 1 1-1.223-.49l.99-2.474-2.474.99a.75.75 0 1 1-.49-1.223l1.223-3.058a.75.75 0 0 1-.21-.843Zm8.818-1.21a.75.75 0 0 0-1.05-.008l-2.06 2.06-1.212-1.212a.75.75 0 0 0-1.06 1.061l1.742 1.742a.75.75 0 0 0 1.06 0l2.59-2.59a.75.75 0 0 0-.008-1.05Z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
      clipRule="evenodd"
    />
  </svg>
);

const AnalysisCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-gray-800 rounded-lg shadow p-6 h-full">
    <h3 className="text-lg font-semibold text-teal-400 mb-3">{title}</h3>
    <div className="text-gray-300 space-y-2">{children}</div>
  </div>
);

export const CombinedAnalysisView: React.FC<{ data: CombinedAnalysisResult }> = ({ data }) => (
  <div className="space-y-6">
    <AnalysisCard title="Tóm tắt & Thẻ">
      <p className="text-2xl font-bold text-white">{data.shotType}</p>
      <p className="text-sm text-gray-400">Độ tin cậy: {(data.confidence * 100).toFixed(0)}%</p>
      <p className="mt-4">{data.description}</p>
      <div className="flex flex-wrap gap-3 mt-4">
        {data.tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center px-3 py-1.5 bg-gray-700 text-teal-300 text-sm font-semibold rounded-full tracking-wide"
          >
            <TagIcon className="h-4 w-4 mr-2" />
            {tag}
          </span>
        ))}
      </div>
    </AnalysisCard>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnalysisCard title="Phân tích tư thế">
        <p>
          <strong className="text-gray-100">Tóm tắt:</strong> {data.pose.summary}
        </p>
        <p>
          <strong className="text-gray-100">Phản hồi:</strong> {data.pose.feedback}
        </p>
      </AnalysisCard>
      <AnalysisCard title="Phân tích chuyển động">
        <p>
          <strong className="text-gray-100">Chuẩn bị:</strong> {data.movement.preparation}
        </p>
        <p>
          <strong className="text-gray-100">Tiếp xúc:</strong> {data.movement.contact}
        </p>
        <p>
          <strong className="text-gray-100">Kết thúc:</strong> {data.movement.followThrough}
        </p>
      </AnalysisCard>
    </div>

    <AnalysisCard title="Đề xuất">
      <ul className="space-y-2">
        {data.recommendations.map((rec, i) => (
          <li key={i} className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </AnalysisCard>
  </div>
);

const ScoreDonut: React.FC<{ score: number }> = ({ score }) => {
  const percentage = score * 10;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-green-400';
  if (score < 7) colorClass = 'text-yellow-400';
  if (score < 4) colorClass = 'text-red-400';

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={colorClass}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <span className={`absolute text-3xl font-bold ${colorClass}`}>{score.toFixed(1)}</span>
    </div>
  );
};

export const VideoComparisonView: React.FC<{
  data: VideoComparisonResult;
  onTimestampClick: (coachTs: number, learnerTs: number) => void;
}> = ({ data, onTimestampClick }) => {
  const renderDetailList = (items: string[], type: 'strength' | 'weakness') => {
    if (!items || items.length === 0) return null;
    const Icon = type === 'strength' ? ArrowUpCircleIcon : ArrowDownCircleIcon;
    const color = type === 'strength' ? 'text-green-400' : 'text-red-400';
    const title = type === 'strength' ? 'Điểm mạnh' : 'Điểm yếu';

    return (
      <div className="mt-3">
        <p className={`font-semibold text-xs mb-1.5 ${color}`}>{title}</p>
        <ul className="space-y-1.5 text-xs text-gray-300">
          {items.map((item, i) => (
            <li key={i} className="flex items-start">
              <Icon className={`h-4 w-4 mr-2 mt-px flex-shrink-0 ${color}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderComparisonBlock = (title: string, block: typeof data.comparison.preparation) => (
    <div key={title} className="bg-gray-900/50 rounded-lg p-4">
      <h4 className="font-semibold text-teal-400 mb-3">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <p className="font-medium text-gray-200 mb-2 flex items-center">
            Học viên
            <button
              onClick={() => onTimestampClick(block.player1.timestamp, block.player2.timestamp)}
              className="ml-2 text-xs font-normal bg-gray-700 text-teal-300 px-2 py-0.5 rounded-full flex items-center hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <ClockIcon className="h-3 w-3 mr-1" />
              {block.player2.timestamp.toFixed(2)}s
            </button>
          </p>
          <p className="text-gray-300">{block.player2.analysis}</p>
          {renderDetailList(block.player2.strengths, 'strength')}
          {renderDetailList(block.player2.weaknesses, 'weakness')}
        </div>
        <div>
          <p className="font-medium text-gray-200 mb-2 flex items-center">
            Huấn luyện viên
            <button
              onClick={() => onTimestampClick(block.player1.timestamp, block.player2.timestamp)}
              className="ml-2 text-xs font-normal bg-gray-700 text-teal-300 px-2 py-0.5 rounded-full flex items-center hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <ClockIcon className="h-3 w-3 mr-1" />
              {block.player1.timestamp.toFixed(2)}s
            </button>
          </p>
          <p className="text-gray-300">{block.player1.analysis}</p>
          {renderDetailList(block.player1.strengths, 'strength')}
          {renderDetailList(block.player1.weaknesses, 'weakness')}
        </div>
      </div>
      <p className="mt-4 text-sm">
        <strong className="text-gray-100">Lợi thế:</strong> {block.advantage}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalysisCard title="Tóm tắt">
          <p>{data.summary}</p>
        </AnalysisCard>
        <div className="lg:col-span-2">
          <AnalysisCard title="Những khác biệt chính">
            <div className="space-y-4">
              {data.keyDifferences.map((diff, i) => (
                <div key={i} className="text-sm p-3 bg-gray-900/50 rounded-md">
                  <p className="font-semibold text-gray-200 flex items-center">
                    <ScaleIcon className="h-4 w-4 mr-2 text-teal-400" />
                    {diff.aspect}
                  </p>
                  <div className="mt-2 pl-4 border-l-2 border-gray-700 space-y-1.5">
                    <p>
                      <strong className="text-gray-400">Huấn luyện viên:</strong>{' '}
                      {diff.player1_technique}
                    </p>
                    <p>
                      <strong className="text-gray-400">Học viên:</strong> {diff.player2_technique}
                    </p>
                  </div>
                  <p className="mt-2">
                    <strong className="text-gray-400">Tác động:</strong> {diff.impact}
                  </p>
                </div>
              ))}
            </div>
          </AnalysisCard>
        </div>
      </div>

      <AnalysisCard title="So sánh Kỹ thuật Chi tiết">
        <div className="space-y-4">
          {renderComparisonBlock('Chuẩn bị', data.comparison.preparation)}
          {renderComparisonBlock('Vung vợt & Tiếp xúc', data.comparison.swingAndContact)}
          {renderComparisonBlock('Kết thúc', data.comparison.followThrough)}
        </div>
      </AnalysisCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalysisCard title="Đề xuất & Bài tập cho Học viên">
            <ul className="space-y-3">
              {data.recommendationsForPlayer2.map((rec, i) => (
                <li key={i} className="p-3 bg-gray-900/50 rounded-md">
                  <p className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{rec.recommendation}</span>
                  </p>
                  <div className="flex items-start text-sm text-yellow-300/80 mt-2 pl-7">
                    <LightBulbIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold">Bài tập: {rec.drill.title}</p>
                      <p className="text-gray-300 mt-1">{rec.drill.description}</p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        Thực hành: {rec.drill.practice_sets}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </AnalysisCard>
        </div>

        <AnalysisCard title="Điểm Tổng thể của Học viên">
          <div className="flex flex-col items-center justify-center h-full">
            <ScoreDonut score={data.overallScoreForPlayer2} />
            <p className="mt-2 text-gray-400 text-sm">Trên thang điểm 10</p>
          </div>
        </AnalysisCard>
      </div>
    </div>
  );
};
