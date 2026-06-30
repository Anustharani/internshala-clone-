import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLanguage } from "@/context/LanguageContext";
// export const internships = [
//   {
//     _id: "1",
//     title: "Frontend Developer Intern",
//     company: "Tech Innovators",
//     location: "Remote",
//     stipend: "$500/month",
//     Duration: "3 Months",
//     StartDate: "March 15, 2025",
//     aboutCompany:
//       "Tech Innovators is a leading software development company specializing in modern web applications.",
//     aboutJob:
//       "As a Frontend Developer Intern, you will work on real-world projects using React.js and Tailwind CSS.",
//     Whocanapply:
//       "Students and fresh graduates with knowledge of HTML, CSS, JavaScript, and React.js.",
//     perks: "Certificate, Letter of Recommendation, Flexible Work Hours",
//     AdditionalInfo: "This is a remote internship with flexible working hours.",
//     numberOfopning: "2",
//   },
//   {
//     _id: "2",
//     title: "Backend Developer Intern",
//     company: "Cloud Systems",
//     location: "San Francisco",
//     stipend: "$800/month",
//     Duration: "4 Months",
//     StartDate: "April 1, 2025",
//     aboutCompany:
//       "Cloud Systems focuses on scalable backend solutions and cloud-based applications.",
//     aboutJob:
//       "As a Backend Developer Intern, you will work with Node.js, Express, and MongoDB.",
//     Whocanapply:
//       "Students with experience in backend technologies and databases.",
//     perks: "Certificate, Networking Opportunities, Paid Internship",
//     AdditionalInfo: "A strong foundation in databases is required.",
//     numberOfopning: "3",
//   },
//   {
//     _id: "3",
//     title: "UI/UX Designer Intern",
//     company: "Creative Minds",
//     location: "New York",
//     stipend: "$600/month",
//     Duration: "6 Months",
//     StartDate: "May 10, 2025",
//     aboutCompany:
//       "Creative Minds is a design agency focused on user experience and interface design.",
//     aboutJob:
//       "As a UI/UX Designer Intern, you will work with Figma, Adobe XD, and design systems.",
//     Whocanapply:
//       "Students passionate about designing intuitive user experiences.",
//     perks: "Mentorship, Hands-on Projects, Letter of Recommendation",
//     AdditionalInfo: "A portfolio is required for application.",
//     numberOfopning: "1",
//   },
// ];

const index = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { id } = router.query;
  const [internshipData,setinternship]=useState<any>([])
  useEffect(()=>{
    const fetchdata=async()=>{
      try {
        const res=await axios.get( `${process.env.NEXT_PUBLIC_API_URL || "https://internshala-clone-y2p2.onrender.com/api"}/internship/${id}`)     
        setinternship(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchdata()
  },[id])
  const [availability, setAvailability] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const user=useSelector(selectuser)
  if (!internshipData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const handlesubmitapplication=async()=>{
    if(!coverLetter.trim()){
      toast.error("please write a cover letter")
      return
    }
    if(!availability){
      toast.error("please select your availability")
      return
    }
    try {
      const applicationdata={
        category:internshipData.category,
        company:internshipData.company,
        coverLetter:coverLetter,
        user:user,
        Application:id,
        availability
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "https://internshala-clone-y2p2.onrender.com/api"}/application`,applicationdata)
      toast.success("Application submit successfully")
      router.push('/internship')
    } catch (error) {
      console.error(error)
      toast.error("Failed to submit application")
    }
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <ArrowUpRight className="h-5 w-5" />
            <span className="font-semibold">{t("actively_hiring")}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {internshipData.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{internshipData.company}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-medium text-gray-700">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{t("location")}: {internshipData.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <span>{t("stipend")}: {internshipData.stipend}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>{t("start_date")}: {internshipData.startDate}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-green-500 text-sm font-semibold">
              {t("posted_on")} {internshipData.createdAt}
            </span>
          </div>
        </div>
        {/* Company Section */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t("about_company")}
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium">{internshipData.aboutCompany}</p>
        </div>
        {/* Internship Details Section */}
        <div className="p-6 border-b border-gray-100 space-y-6 text-gray-700 font-medium">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t("about_internship")}
            </h2>
            <p className="text-gray-600 leading-relaxed">{internshipData.aboutInternship}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("who_can_apply")}
            </h3>
            <p className="text-gray-600 leading-relaxed">{internshipData.whoCanApply}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t("perks")}</h3>
            <p className="text-gray-600 leading-relaxed">{internshipData.perks}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("additional_info")}
            </h3>
            <p className="text-gray-600 leading-relaxed">{internshipData.additionalInfo}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("openings")}
            </h3>
            <p className="text-gray-600 leading-relaxed">{internshipData.numberOfOpening}</p>
          </div>
        </div>
        {/* Apply Button */}
        <div className="p-6 flex justify-center bg-gray-50">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-150 cursor-pointer shadow-lg shadow-blue-600/10"
          >
            {t("apply_now")}
          </button>
        </div>
      </div>
      {/* Apply Modal */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("apply_now")} - {internshipData.company}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Resume Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {t("your_resume")}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  {t("resume_sub")}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {t("cover_letter")}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  {t("cover_letter_question")}
                </p>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black outline-none font-medium placeholder-gray-400"
                  placeholder={t("write_cover_letter_placeholder")}
                ></textarea>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {t("availability")}
                </h3>
                <div className="space-y-3 font-medium">
                  {[
                    "Yes, I am available to join immediately",
                    "No, I am currently on notice period",
                    "No, I will have to serve notice period",
                    "Other",
                  ].map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value={option}
                        checked={availability === option}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-100">
                {user ? (
                  <button className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 cursor-pointer shadow-lg shadow-blue-600/10" onClick={handlesubmitapplication}>
                    {t("submit_application")}
                  </button>
                ) : (
                  <Link
                    href={`/`}
                    className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 cursor-pointer text-center shadow-lg shadow-blue-600/10"
                  >
                    {t("sign_up_to_apply")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
