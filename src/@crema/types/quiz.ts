import { FormInstance } from 'antd';

export interface QuizQuestionFormValue {
  title: string;
  explanation?: string;
  options: string[];
  correctOptionIndex: number;
}

export interface CreateQuizFormValues {
  title: string;
  description?: string;
  lessonId?: string | number;
  questions: QuizQuestionFormValue[];
}

export interface LessonOption {
  label: string;
  value: string | number;
}

export interface CreateQuizModalProps {
  open: boolean;
  form: FormInstance<CreateQuizFormValues>;
  onSubmit: () => void;
  onClose: () => void;
  submitting?: boolean;
  lessonsOptions: LessonOption[];
}
