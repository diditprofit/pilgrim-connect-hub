import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

export interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  duration: number; // in minutes
  content?: string;
  videoUrl?: string;
  documentUrl?: string;
  quizQuestions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  targetRole: 'agen' | 'cabang';
  lessons: CourseLesson[];
  totalDuration: number;
  certificateTemplate: string;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  currentLesson: string;
  progress: number; // 0-100
  startedAt: string;
  completedAt?: string;
  certificateIssued?: boolean;
  quizScores: { [lessonId: string]: number };
}

interface ECourseContextType {
  courses: Course[];
  userProgress: CourseProgress[];
  startCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string, score?: number) => void;
  issueCertificate: (courseId: string) => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  getCoursesForRole: (role: string) => Course[];
}

const ECourseContext = createContext<ECourseContextType | undefined>(undefined);

// Mock course data
const mockCourses: Course[] = [
  // Agent Courses
  {
    id: 'AGENT_SALES_101',
    title: 'Sales Excellence for Umrah & Hajj',
    description: 'Master the art of selling spiritual journeys with ethical sales techniques',
    category: 'Sales',
    targetRole: 'agen',
    totalDuration: 180,
    certificateTemplate: 'sales-excellence',
    lessons: [
      {
        id: 'L001',
        title: 'Understanding Your Customers Spiritual Needs',
        type: 'video',
        duration: 45,
        videoUrl: '/videos/customer-needs.mp4'
      },
      {
        id: 'L002',
        title: 'Ethical Sales Techniques in Religious Tourism',
        type: 'video',
        duration: 60,
        videoUrl: '/videos/ethical-sales.mp4'
      },
      {
        id: 'L003',
        title: 'Handling Objections with Empathy',
        type: 'document',
        duration: 30,
        documentUrl: '/docs/objection-handling.pdf'
      },
      {
        id: 'L004',
        title: 'Sales Assessment',
        type: 'quiz',
        duration: 45,
        quizQuestions: [
          {
            id: 'Q001',
            question: 'What is the most important factor when selling Umrah packages?',
            options: ['Price', 'Spiritual value', 'Hotel ratings', 'Flight schedule'],
            correctAnswer: 1
          },
          {
            id: 'Q002',
            question: 'How should you handle price objections?',
            options: ['Immediately offer discounts', 'Focus on value and spiritual benefits', 'Ignore the objection', 'Change the topic'],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  {
    id: 'AGENT_MARKETING_101',
    title: 'Digital Marketing for Umrah Agents',
    description: 'Learn modern digital marketing strategies for promoting spiritual travel',
    category: 'Marketing',
    targetRole: 'agen',
    totalDuration: 210,
    certificateTemplate: 'digital-marketing',
    lessons: [
      {
        id: 'L005',
        title: 'Social Media Marketing for Religious Travel',
        type: 'video',
        duration: 60,
        videoUrl: '/videos/social-media.mp4'
      },
      {
        id: 'L006',
        title: 'Content Creation Best Practices',
        type: 'video',
        duration: 75,
        videoUrl: '/videos/content-creation.mp4'
      },
      {
        id: 'L007',
        title: 'WhatsApp Marketing Strategies',
        type: 'document',
        duration: 30,
        documentUrl: '/docs/whatsapp-marketing.pdf'
      },
      {
        id: 'L008',
        title: 'Marketing Assessment',
        type: 'quiz',
        duration: 45,
        quizQuestions: [
          {
            id: 'Q003',
            question: 'Which platform is most effective for Umrah marketing in Indonesia?',
            options: ['Facebook', 'Instagram', 'WhatsApp', 'All of the above'],
            correctAnswer: 3
          }
        ]
      }
    ]
  },
  {
    id: 'AGENT_OPERATIONS_101',
    title: 'Operational Excellence for Agents',
    description: 'Master the operational aspects of managing Umrah & Hajj registrations',
    category: 'Operations',
    targetRole: 'agen',
    totalDuration: 150,
    certificateTemplate: 'operations',
    lessons: [
      {
        id: 'L009',
        title: 'Document Processing Workflows',
        type: 'video',
        duration: 45,
        videoUrl: '/videos/document-processing.mp4'
      },
      {
        id: 'L010',
        title: 'Payment Management Best Practices',
        type: 'video',
        duration: 60,
        videoUrl: '/videos/payment-management.mp4'
      },
      {
        id: 'L011',
        title: 'Customer Service Excellence',
        type: 'document',
        duration: 30,
        documentUrl: '/docs/customer-service.pdf'
      },
      {
        id: 'L012',
        title: 'Operations Assessment',
        type: 'quiz',
        duration: 15,
        quizQuestions: [
          {
            id: 'Q004',
            question: 'What is the first step in document processing?',
            options: ['Upload to system', 'Verify authenticity', 'Send to branch', 'Contact customer'],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  // Branch Manager Courses
  {
    id: 'BRANCH_MANAGEMENT_101',
    title: 'Branch Management Fundamentals',
    description: 'Essential skills for managing a successful Umrah & Hajj branch',
    category: 'Management',
    targetRole: 'cabang',
    totalDuration: 240,
    certificateTemplate: 'branch-management',
    lessons: [
      {
        id: 'L013',
        title: 'Leadership in Islamic Business',
        type: 'video',
        duration: 60,
        videoUrl: '/videos/islamic-leadership.mp4'
      },
      {
        id: 'L014',
        title: 'Team Building and Motivation',
        type: 'video',
        duration: 75,
        videoUrl: '/videos/team-building.mp4'
      },
      {
        id: 'L015',
        title: 'Branch Performance Metrics',
        type: 'document',
        duration: 45,
        documentUrl: '/docs/performance-metrics.pdf'
      },
      {
        id: 'L016',
        title: 'Conflict Resolution',
        type: 'video',
        duration: 45,
        videoUrl: '/videos/conflict-resolution.mp4'
      },
      {
        id: 'L017',
        title: 'Management Assessment',
        type: 'quiz',
        duration: 15,
        quizQuestions: [
          {
            id: 'Q005',
            question: 'What is the most important quality of a branch manager?',
            options: ['Technical skills', 'Leadership', 'Sales ability', 'Product knowledge'],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  {
    id: 'BRANCH_WORKFLOWS_101',
    title: 'Approval Workflows & Process Management',
    description: 'Master the approval processes and workflow management',
    category: 'Workflows',
    targetRole: 'cabang',
    totalDuration: 180,
    certificateTemplate: 'workflow-management',
    lessons: [
      {
        id: 'L018',
        title: 'Document Approval Procedures',
        type: 'video',
        duration: 60,
        videoUrl: '/videos/approval-procedures.mp4'
      },
      {
        id: 'L019',
        title: 'Quality Control Standards',
        type: 'video',
        duration: 45,
        videoUrl: '/videos/quality-control.mp4'
      },
      {
        id: 'L020',
        title: 'Escalation Procedures',
        type: 'document',
        duration: 30,
        documentUrl: '/docs/escalation-procedures.pdf'
      },
      {
        id: 'L021',
        title: 'Process Optimization',
        type: 'video',
        duration: 30,
        videoUrl: '/videos/process-optimization.mp4'
      },
      {
        id: 'L022',
        title: 'Workflow Assessment',
        type: 'quiz',
        duration: 15,
        quizQuestions: [
          {
            id: 'Q006',
            question: 'When should a document be escalated to admin level?',
            options: ['Always', 'When in doubt', 'Only for major issues', 'When customer requests'],
            correctAnswer: 2
          }
        ]
      }
    ]
  },
  {
    id: 'BRANCH_PERFORMANCE_101',
    title: 'Team Performance Tracking & Analytics',
    description: 'Learn to track, analyze, and improve team performance',
    category: 'Analytics',
    targetRole: 'cabang',
    totalDuration: 150,
    certificateTemplate: 'performance-tracking',
    lessons: [
      {
        id: 'L023',
        title: 'KPI Development and Tracking',
        type: 'video',
        duration: 45,
        videoUrl: '/videos/kpi-tracking.mp4'
      },
      {
        id: 'L024',
        title: 'Performance Review Techniques',
        type: 'video',
        duration: 60,
        videoUrl: '/videos/performance-review.mp4'
      },
      {
        id: 'L025',
        title: 'Data Analysis for Branch Managers',
        type: 'document',
        duration: 30,
        documentUrl: '/docs/data-analysis.pdf'
      },
      {
        id: 'L026',
        title: 'Performance Assessment',
        type: 'quiz',
        duration: 15,
        quizQuestions: [
          {
            id: 'Q007',
            question: 'How often should performance reviews be conducted?',
            options: ['Annually', 'Quarterly', 'Monthly', 'Weekly'],
            correctAnswer: 1
          }
        ]
      }
    ]
  }
];

export function ECourseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([]);

  const startCourse = (courseId: string) => {
    if (!user) return;
    
    const existingProgress = userProgress.find(p => p.courseId === courseId && p.userId === user.id);
    if (existingProgress) return;

    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return;

    const newProgress: CourseProgress = {
      courseId,
      userId: user.id,
      completedLessons: [],
      currentLesson: course.lessons[0]?.id || '',
      progress: 0,
      startedAt: new Date().toISOString(),
      quizScores: {}
    };

    setUserProgress(prev => [...prev, newProgress]);
  };

  const completeLesson = (courseId: string, lessonId: string, score?: number) => {
    if (!user) return;

    setUserProgress(prev => prev.map(progress => {
      if (progress.courseId === courseId && progress.userId === user.id) {
        const course = mockCourses.find(c => c.id === courseId);
        if (!course) return progress;

        const completedLessons = [...progress.completedLessons];
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        }

        const newProgress = Math.round((completedLessons.length / course.lessons.length) * 100);
        const isCompleted = newProgress === 100;

        const updatedQuizScores = { ...progress.quizScores };
        if (score !== undefined) {
          updatedQuizScores[lessonId] = score;
        }

        return {
          ...progress,
          completedLessons,
          progress: newProgress,
          completedAt: isCompleted ? new Date().toISOString() : progress.completedAt,
          quizScores: updatedQuizScores
        };
      }
      return progress;
    }));
  };

  const issueCertificate = (courseId: string) => {
    if (!user) return;

    setUserProgress(prev => prev.map(progress => {
      if (progress.courseId === courseId && progress.userId === user.id && progress.progress === 100) {
        return {
          ...progress,
          certificateIssued: true
        };
      }
      return progress;
    }));
  };

  const getCourseProgress = (courseId: string): CourseProgress | undefined => {
    if (!user) return undefined;
    return userProgress.find(p => p.courseId === courseId && p.userId === user.id);
  };

  const getCoursesForRole = (role: string): Course[] => {
    return mockCourses.filter(course => course.targetRole === role);
  };

  return (
    <ECourseContext.Provider value={{
      courses: mockCourses,
      userProgress,
      startCourse,
      completeLesson,
      issueCertificate,
      getCourseProgress,
      getCoursesForRole
    }}>
      {children}
    </ECourseContext.Provider>
  );
}

export function useECourse() {
  const context = useContext(ECourseContext);
  if (context === undefined) {
    throw new Error('useECourse must be used within an ECourseProvider');
  }
  return context;
}