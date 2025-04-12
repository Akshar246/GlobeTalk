// import axios from "axios";
// import { server } from "../constants/config";

// const translateTextViaBackend = async (text, targetLang) => {
//   try {
//     const res = await axios.post(`${server}/api/v1/translate`, {
//       text,
//       targetLang,
//     });

//     return res.data.translatedText;
//   } catch (error) {
//     console.error("Backend Translation Error:", error);
//     return text; // fallback to original
//   }
// };
// export{ translateTextViaBackend};