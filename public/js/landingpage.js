const generatebtn = document.getElementById('generate_code');
const codeInput = document.getElementById('code');

//generate code and display route
generatebtn.addEventListener('click', () => {
  try {
    fetch('/code/generate')
      .then(response => response.json())
      .then(data => {
        document.getElementById('code').value = data.code;
      });
  }
  catch (error) {
    console.error("Error generating code:", error);
  };
});
