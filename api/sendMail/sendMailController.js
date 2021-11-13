const open = require('opn');
const sendMailService = require('./sendMailService');

exports.joinClassByEmail = async (req, res) => {
    const data = await sendMailService.joinClass(req.query.email, req.query.invite_code);
    if (data) {
      const link = process.env.FRONTEND_HOST+"/detail-classroom/" + data.id_class;
      res.redirect(link);
    } else {
        const link = process.env.FRONTEND_HOST+"/login";
        res.redirect(link);
    }
  }