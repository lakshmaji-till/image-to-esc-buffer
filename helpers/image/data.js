const fetch = require("cross-fetch");

const HOST = 'http://127.0.0.1:8080';
const getOrgLogo = async () => {
  try {
    // http://10.0.2.2/ (android emul)
    // or
    // http://10.0.3.2/ (genymotion)
    const response = await fetch(`${HOST}/getbitmap`);
    const res = await response.json();
    return res.imgData; // base64
  } catch (err) {
    console.log('err', err);
  }
};
const getImgTemplateData = orgLogo => {
  return {
    title: 'Park Hyatt',
    imgData: orgLogo, // a base64 string
  };
};

module.exports = {
  getOrgLogo,
  getImgTemplateData
}