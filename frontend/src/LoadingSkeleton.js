import React from "react";
import "./skeleton.css";

export const ReportSkeleton = () => (
  <div className="skeleton-report">
    <div className="skeleton-header">
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-circle"></div>
    </div>
    <div className="skeleton-text skeleton-subtitle"></div>
  </div>
);

export const EmotionCardSkeleton = () => (
  <div className="skeleton-emotion-card">
    <div className="skeleton-text skeleton-small"></div>
    <div className="skeleton-text skeleton-large"></div>
    <div className="skeleton-bar"></div>
  </div>
);
