"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    option: "",
    phone: "",
    message: "",
  });

  const [sent, setSent] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update only if the input field is not the select dropdown
    if (name !== 'selectOption') {
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        option: value // Update selectOption directly
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate mandatory fields
    if (!formData.fullname || !formData.email || !formData.option || !formData.message) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    // Send email based on selectOption
    let recipientEmail;
    switch (formData.option) {
      case "new-site":
        recipientEmail = "sales@greenchains.io";
        break;
      case "issue":
        recipientEmail = "support@greenchains.io";
        break;
      case "query":
        recipientEmail = "support@greenchains.io"; // or another email for queries
        break;
      default:
        recipientEmail = "support@greenchains.io";
        break;
    }

    // Here you can implement the logic to send an email using your preferred method or API

    // For demonstration, we log the form data and recipient email
    console.log("Form Data:", formData);
    console.log("Recipient Email:", recipientEmail);

    // Optionally, reset form fields
    setFormData({
      fullname: "",
      email: "",
      option: "",
      phone: "",
      message: "",
    });
    try {
      const form = new FormData();
      form.append("fullname", formData.fullname);
      form.append("email", formData.email);
      form.append("option", formData.option);
      form.append("phone", formData.phone);
      form.append("message", formData.message);

      const response = await fetch('/api/email', {
        method: 'POST',
        body: form
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          console.log("Email sent successfully");
          setSent(1);
        } else {
          setSent(-1);
          console.log('Failed: ', data.message);
        }
      } else {
        console.error('Failed to send request:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      setSent(-1);
    }


  };

  return (
    <>
      <section id="contact" className="px-4 md:px-8 2xl:px-0">
        <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
            <Image
              src="./images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
              fill
            />
            <Image
              src="./images/shape/shape-dotted-dark.svg"
              alt="Dotted"
              className="hidden dark:block"
              fill
            />
          </div>

          <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20 w-full">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:p-15"
              style={{ width: '100%' }}
            >
              <h2 className="mb-15 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                Contact our Experts
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    required
                  />
                </div>

                <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <select
                    name="selectOption"
                    value={formData.option}
                    onChange={handleInputChange}
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="new-site">Sales</option>
                    <option value="issue">Issue</option>
                    <option value="query">General Query</option>
                  </select>

                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                  />
                </div>

                <div className="mb-11.5 flex">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your request"
                    rows={4}
                    className="w-full border-b border-stroke bg-transparent focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    required
                  ></textarea>
                </div>

                <div className="mb-11.5 flex">
                  {sent === 1 ? (
                    <p style={{ color: "green" }}>Email sent successfully. One of our team will get back to you within one business day.</p>
                  ) : sent === -1 ? (
                    <p style={{ color: "red" }}>Something went wrong. Please try again later.</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-4 xl:justify-end">
                  <button
                    type="submit"
                    aria-label="send message"
                    className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                  >
                    Send
                    <svg
                      className="fill-white"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },

                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 2, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-2/5 md:p-7.5 lg:w-[26%] xl:pt-15"
            >
              <h2 className="mb-12.5 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                Find us
              </h2>

              <div className="5 mb-7">
                <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                  Our Location
                </h3>
                <p>290 Maryam Springs 260, Courbevoie, Paris, France</p>
              </div>
              <div className="5 mb-7">
                <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                  Email Address
                </h3>
                <p>
                  <a href="mailto:support@greenchains.io">support@greenchains.io</a>
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                  Phone Number
                </h4>
                <p>
                  <a href="tel:+009423346343843">+009 42334 6343 843</a>
                </p>
              </div>
            </motion.div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
