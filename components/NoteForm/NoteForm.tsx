import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { NewNote } from '@/lib/api';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Maximum 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});


export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation= useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        mutation.mutate({
            ...values,
            tag: values.tag as NewNote['tag'], 
        },
        {
          onSettled: () => setSubmitting(false)
        },
      );
    }}
    >
  {({ isSubmitting }) => (
    <Form className={css.form}>
        <div className={css.formGroup}>
            <label htmlFor="title" className={css.label}>Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />            
        </div>

        <div className={css.formGroup}>
            <label htmlFor="content" className={css.label}>Content</label>
            <Field id="content" name="content" as="textarea" rows={8} className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />       
        </div>

        <div className={css.formGroup}>
            <label htmlFor="tag" className={css.label}>Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />   
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}  disabled={isSubmitting}>
            Create note
          </button>
          <button type="button" onClick={onClose} className={css.cancelButton} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </Form>
  )}
    </Formik>
  );
};


