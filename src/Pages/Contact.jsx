import React, { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import { Link } from "react-router-dom";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: 'Sending Message...',
      html: 'Please wait while we send your message',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Get form data
      const form = e.target;
      const formData = new FormData(form);

      // Submit form
      await form.submit();

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Your message has been sent successfully!',
        icon: 'success',
        confirmButtonColor: '#c9a24b',
        timer: 2000,
        timerProgressBar: true
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonColor: '#c9a24b'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto mt-20 flex max-w-3xl flex-col items-center px-[5%] text-center md:px-[7%] lg:px-[10%]">
        <span className="eyebrow mb-5" data-aos="fade-down" data-aos-duration="900">Let's Connect</span>
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="font-display text-3xl font-bold tracking-tight text-luxe-gradient md:text-5xl"
        >
          Get In Touch
        </h2>
        <div className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#e6c078]/60 to-transparent" />
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base"
        >
          Have a project in mind or just want to chat? Send me a message and let's create something amazing together.
        </p>
      </div>

      <div
        className="mx-auto mt-10 grid max-w-7xl grid-cols-1 items-start gap-8 px-[5%] md:px-[7%] lg:grid-cols-2 lg:px-[10%]"
        id="Contact"
      >
        <div>
          <div
            data-aos="fade-right"
            data-aos-duration="1200"
            className="premium-card w-full p-5 py-10 sm:p-10"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="font-display text-4xl font-bold mb-3 text-luxe-gradient">
                  Get in Touch
                </h2>
                <p className="text-gray-400">
                  Have something to discuss? Send me a message and let's talk.
                </p>
              </div>
              <Share2 className="w-10 h-10 text-[#e6c078] opacity-70" />
            </div>

            <form 
              action="https://formsubmit.co/abdullah80169@gmail.com"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* FormSubmit Configuration */}
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />

              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="relative group"
              >
                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
                  required
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="relative group"
              >
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
                  required
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="relative group"
              >
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 h-[9.9rem] disabled:opacity-50"
                  required
                />
              </div>
              <button
                data-aos="fade-up"
                data-aos-delay="400"
                type="submit"
                disabled={isSubmitting}
                className="btn-luxe w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-center space-x-6">
            </div>
          </div>

        </div>
        <div
            data-aos="fade-left"
            data-aos-duration="1200"
            className="premium-card w-full p-5 py-10 sm:p-10"
          >
     <SocialLinks />

            </div>
      </div>
    </>
  );
};

export default ContactPage;
