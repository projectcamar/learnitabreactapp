'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import Logo from '../public/images/Logo Learnitab.png';
import { FiSearch, FiBriefcase, FiAward, FiBookOpen, FiUsers, FiChevronDown, FiHeart, FiMessageSquare, FiYoutube, FiLinkedin, FiInstagram, FiLink, FiMenu, FiCalendar, FiTrash2, FiClock, FiBell, FiRotateCw } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { Post } from '@/types/Post';
import { useSearchParams } from 'next/navigation';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { Suspense } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

type CalendarEvent = {
  id: string;
  title: string;
  deadline: string;
};

export default function Home() {
  console.log('Starting to render Home component');

  useEffect(() => {
    console.log('Home component mounted');
  }, []);

  console.log('About to return JSX');

  return (
    <ErrorBoundary>
      <div>
        <h1>Loading...</h1>
      </div>
    </ErrorBoundary>
  );
}
