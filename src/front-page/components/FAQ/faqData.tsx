import { FAQ } from "types/faq";

const faqData: FAQ[] = [
  {
    id: 1,
    quest: "What is NFC verification?",
    ans: "NFC verification uses Near Field Communication to validate identities via NFC-enabled devices. It works with e-passports and ID cards for fast and secure authentication.",
  },
  {
    id: 2,
    quest: "What is OCR verification?",
    ans: "Optical Character Recognition (OCR) allows the extraction of data from identity documents, providing a quick and accurate way to verify user information.",
  },
  {
    id: 3,
    quest: "How do I integrate NCTR into my app?",
    ans: "You can integrate NCTR using our SDKs for iOS and Android or through our APIs for web applications. Detailed integration guides and sample code are available.",
  },
  {
    id: 4,
    quest: "Is NCTR compatible with both mobile and web platforms?",
    ans: "Yes, NCTR supports Android, iOS, and web platforms, ensuring flexibility for your app or website.",
  },
  {
    id: 5,
    quest: "Can I test the platform before going live?",
    ans: "Yes, we provide a sandbox account for testing, allowing you to evaluate our platform before fully integrating it.",
  },
];

export default faqData;