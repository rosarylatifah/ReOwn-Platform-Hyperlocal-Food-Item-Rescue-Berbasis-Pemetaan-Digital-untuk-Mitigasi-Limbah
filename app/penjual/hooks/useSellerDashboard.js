import { useState, useEffect } from 'react';
import { initialActivities } from '@/lib/penjual/dashboardData';

export function useSellerDashboard() {
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [chartScale, setChartScale] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  // State untuk interaktif chart (tooltip & titik aktif)
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const filteredActivities = initialActivities.filter(item => 
    item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChartScroll = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setChartScale((prev) => Math.min(prev + 0.1, 1.3));
    } else {
      setChartScale((prev) => Math.max(prev - 0.1, 0.9));
    }
  };

  return {
    activeCard, setActiveCard,
    hoveredRow, setHoveredRow,
    searchTerm, setSearchTerm,
    activeModal, setActiveModal,
    chartScale,
    currentTime, formattedDate, formattedTime,
    filteredActivities,
    handleChartScroll,
    activeTooltip, setActiveTooltip
  };
}