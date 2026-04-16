import crypto from 'crypto';
export const generateCode = async (req, res) => {
  try {
    const code = crypto.randomBytes(3).toString('hex');
    return res.status(200).json({data: {
        message: "code generated successfully",
        code: code
    }}) 
  }catch(error){
    console.log(error);
    return res.status(500).json({message: "error from the server"});
  }};