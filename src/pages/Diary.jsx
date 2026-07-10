import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiChevronLeft, FiChevronRight, FiClock, FiPlus, FiBriefcase, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getHearings } from '../services/diaryService';
import { fetchHearingsStart, fetchHearingsSuccess, fetchHearingsFailure } from '../features/diary/diarySlice';

import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Badge from '../Components/ui/Badge';
import Skeleton from '../Components/ui/Skeleton';
import './Diary.css';

const Diary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useAuth();
  const toast = useToast();

  const { hearings, isLoading } = useSelector(state => state.diary);
  
  // Current calendar month view parameters
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateStr, setSelectedDateStr] = useState(today.toISOString().split('T')[0]);

  useEffect(() => {
    const loadHearings = async () => {
      dispatch(fetchHearingsStart());
      try {
        const data = await getHearings(token);
        dispatch(fetchHearingsSuccess(data));
      } catch (err) {
        dispatch(fetchHearingsFailure(err.message));
        toast.error('Failed to load hearing diary.');
      }
    };
    loadHearings();
  }, [dispatch, token, toast]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar dates math
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  const datesArray = [];
  // Fill leading empty slots
  for (let i = 0; i < firstDayIndex; i++) {
    datesArray.push(null);
  }
  // Fill days
  for (let i = 1; i <= lastDay; i++) {
    datesArray.push(i);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getFormatDateString = (dayNum) => {
    if (!dayNum) return '';
    const dStr = String(dayNum).padStart(2, '0');
    const mStr = String(month + 1).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  const getHearingsForDay = (dayNum) => {
    if (!dayNum) return [];
    const dateStr = getFormatDateString(dayNum);
    return hearings.filter(h => h.date === dateStr);
  };

  const selectedDateHearings = hearings.filter(h => h.date === selectedDateStr);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="diary-header flex justify-between items-center w-full">
        <div>
          <h1 className="display-font" style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
            Hearing Diary
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Schedule and track appearances across supreme, high, and district courts.
          </p>
        </div>
        <Button variant="primary" icon={FiPlus}>
          Schedule Hearing
        </Button>
      </div>

      {/* Grid structure */}
      <div className="diary-grid">
        {/* Left: Monthly Calendar Card */}
        <Card padding="md" className="calendar-card flex-col">
          {/* Month Navigator */}
          <div className="calendar-navigator flex justify-between items-center w-full">
            <h3 className="calendar-month-title display-font">{monthNames[month]} {year}</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" icon={FiChevronLeft} onClick={prevMonth} />
              <Button size="sm" variant="secondary" icon={FiChevronRight} onClick={nextMonth} />
            </div>
          </div>

          {/* Weekday headers */}
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="weekday-header">{d}</span>
            ))}
          </div>

          {/* Calendar cell grids */}
          <div className="calendar-cells-grid">
            {isLoading ? (
              <Skeleton width="100%" height={260} />
            ) : (
              datesArray.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="calendar-cell calendar-cell--empty" />;
                }
                const dateStr = getFormatDateString(day);
                const dayHearings = getHearingsForDay(day);
                const isSelected = selectedDateStr === dateStr;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`calendar-cell ${isSelected ? 'calendar-cell--selected' : ''}`}
                  >
                    <span className="cell-day-num">{day}</span>
                    {dayHearings.length > 0 && (
                      <div className="cell-markers flex gap-1">
                        {dayHearings.map(h => (
                          <span 
                            key={h.id} 
                            className={`cell-marker-dot cell-marker-dot--${h.status === 'In Progress' ? 'warning' : h.status === 'Done' ? 'neutral' : 'info'}`} 
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Right: Selected Date details list */}
        <div className="diary-detail-side flex flex-col gap-6">
          <Card header={`Hearings: ${selectedDateStr}`} padding="md" className="hearings-list-card flex-col">
            <div className="day-hearings-scroller">
              {isLoading ? (
                <Skeleton lines={3} />
              ) : selectedDateHearings.length > 0 ? (
                <div className="day-hearings-list flex flex-col gap-4">
                  {selectedDateHearings.map(h => (
                    <div 
                      key={h.id} 
                      className="diary-hearing-item flex flex-col gap-2"
                      onClick={() => navigate(`/cases/${h.caseId}`)}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="diary-hearing-time flex items-center gap-1"><FiClock /> {h.time}</span>
                        <Badge variant={h.status === 'In Progress' ? 'warning' : h.status === 'Done' ? 'success' : 'info'}>{h.status}</Badge>
                      </div>
                      <h4 className="diary-hearing-title">{h.caseTitle}</h4>
                      <p className="diary-hearing-court flex items-center gap-1"><FiMapPin /> {h.court}</p>
                      <p className="diary-hearing-purpose flex items-center gap-1"><FiBriefcase /> Purpose: {h.purpose}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-diary flex flex-col items-center justify-center">
                  <span className="empty-diary-icon">📭</span>
                  <p>No court appearances scheduled on this date.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Diary;
