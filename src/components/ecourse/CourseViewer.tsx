import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Course, CourseLesson, QuizQuestion, useECourse } from '@/contexts/ECourseContext';
import { ArrowLeft, ArrowRight, Play, FileText, HelpCircle, Award, Download } from 'lucide-react';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

export function CourseViewer({ course, onBack }: CourseViewerProps) {
  const { getCourseProgress, completeLesson, issueCertificate } = useECourse();
  const progress = getCourseProgress(course.id);
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(() => {
    if (!progress) return 0;
    const currentLessonId = progress.currentLesson;
    const index = course.lessons.findIndex(l => l.id === currentLessonId);
    return index >= 0 ? index : 0;
  });

  const currentLesson = course.lessons[currentLessonIndex];
  const isLessonCompleted = progress?.completedLessons.includes(currentLesson.id) || false;
  const courseCompleted = progress?.progress === 100;
  const canIssueCertificate = courseCompleted && !progress?.certificateIssued;

  const goToNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const markLessonComplete = (score?: number) => {
    completeLesson(course.id, currentLesson.id, score);
  };

  const handleIssueCertificate = () => {
    issueCertificate(course.id);
  };

  const renderLessonContent = () => {
    switch (currentLesson.type) {
      case 'video':
        return <VideoLesson lesson={currentLesson} onComplete={() => markLessonComplete()} />;
      case 'document':
        return <DocumentLesson lesson={currentLesson} onComplete={() => markLessonComplete()} />;
      case 'quiz':
        return <QuizLesson lesson={currentLesson} onComplete={markLessonComplete} />;
      default:
        return <div>Unknown lesson type</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        
        {canIssueCertificate && (
          <Button onClick={handleIssueCertificate} className="bg-gradient-to-r from-accent to-accent-glow">
            <Award className="h-4 w-4 mr-2" />
            Get Certificate
          </Button>
        )}
      </div>

      {/* Course Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </div>
            <Badge variant="secondary">{course.category}</Badge>
          </div>
          
          {progress && (
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-sm">
                <span>Course Progress</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} />
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                {currentLesson.type === 'video' && <Play className="h-5 w-5 text-primary" />}
                {currentLesson.type === 'document' && <FileText className="h-5 w-5 text-primary" />}
                {currentLesson.type === 'quiz' && <HelpCircle className="h-5 w-5 text-primary" />}
                <CardTitle className="text-lg">{currentLesson.title}</CardTitle>
                {isLessonCompleted && <Badge variant="default">Completed</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              {renderLessonContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={goToPreviousLesson}
              disabled={currentLessonIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={goToNextLesson}
              disabled={currentLessonIndex === course.lessons.length - 1}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Lesson List */}
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {course.lessons.map((lesson, index) => {
              const completed = progress?.completedLessons.includes(lesson.id) || false;
              const current = index === currentLessonIndex;
              
              return (
                <div
                  key={lesson.id}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    current ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setCurrentLessonIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {lesson.type === 'video' && <Play className="h-4 w-4" />}
                      {lesson.type === 'document' && <FileText className="h-4 w-4" />}
                      {lesson.type === 'quiz' && <HelpCircle className="h-4 w-4" />}
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </div>
                    {completed && <Badge variant="default" className="text-xs">✓</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {lesson.duration} minutes
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Lesson Components
function VideoLesson({ lesson, onComplete }: { lesson: CourseLesson; onComplete: () => void }) {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Video: {lesson.title}</p>
          <p className="text-sm text-muted-foreground">Duration: {lesson.duration} minutes</p>
        </div>
      </div>
      <Button onClick={onComplete} className="w-full">
        Mark as Complete
      </Button>
    </div>
  );
}

function DocumentLesson({ lesson, onComplete }: { lesson: CourseLesson; onComplete: () => void }) {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-muted rounded-lg">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium">{lesson.title}</p>
          <p className="text-sm text-muted-foreground">Reading time: {lesson.duration} minutes</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={onComplete} className="flex-1">
          Mark as Complete
        </Button>
      </div>
    </div>
  );
}

function QuizLesson({ lesson, onComplete }: { lesson: CourseLesson; onComplete: (score: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = lesson.quizQuestions || [];
  const question = questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.filter((answer, index) => 
        answer === questions[index].correctAnswer
      ).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      setShowResults(true);
      onComplete(score);
    }
  };

  if (showResults) {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="space-y-4 text-center">
        <div className="p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-lg">
          <Award className="h-12 w-12 mx-auto mb-4 text-success" />
          <h3 className="text-xl font-bold text-success">Quiz Completed!</h3>
          <p className="text-lg mt-2">Your Score: {score}%</p>
          <p className="text-sm text-muted-foreground">
            {correctAnswers} out of {questions.length} correct answers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-32 h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left justify-start h-auto p-4"
              onClick={() => handleAnswer(index)}
            >
              <span className="text-sm font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}