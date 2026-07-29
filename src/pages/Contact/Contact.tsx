import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './Contact.scss';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(10, 'Name must be at most 100 characters'),
  email: z.email('Enter a valid email address').trim(),
  subject: z.string().trim().max(50, 'Subject must be at most 150 characters').optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be at most 2000 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  // No backend endpoint exists yet to actually deliver the message, so
  // submission is simulated: validate, then show a confirmation and reset.
  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    reset();
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <p>
        If you have any questions, feedback, or inquiries, please feel free to contact us using the information below or by filling out the contact form.
      </p>

      <div className="contact-info">
        <h2>Contact Information</h2>
        <p>Email: info@cryptoapp.com</p>
        <p>Phone: +380987654321</p>
        <p>Address: 123 Crypto Street, Blockchain City</p>
      </div>

      <div className="contact-form">
        <h2>Send us a Message</h2>
        {isSubmitSuccessful && <p className="success-message">Thanks! Your message has been sent.</p>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" {...register('name')} />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" {...register('email')} />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" {...register('subject')} />
            {errors.subject && <p className="error-message">{errors.subject.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea id="message" rows={5} {...register('message')}></textarea>
            {errors.message && <p className="error-message">{errors.message.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting}>Send Message</button>
        </form>
      </div>
    </div>
  );
}
