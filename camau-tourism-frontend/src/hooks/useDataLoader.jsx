import React from 'react';
import { motion } from 'framer-motion';
import ErrorMessage from "../components/Common/ErrorMessage"
import LoadingSpinner from "../components/Common/LoadingSpinner"
import NoResults from "../components/Common/NoResults"
import SkeletonCard from "../components/Common/SkeletonCard"
export const DataLoader = ({ isLoading, error, dataLength, skeleton, noData, children }) => {
  if (isLoading) {
    return skeleton || <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (dataLength === 0) {
    return noData || <NoResults />;
  }

  return children;
};
