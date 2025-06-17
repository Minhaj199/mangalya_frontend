


export const districtsOfKerala = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Trivandrum",
  "Thrissur",
  "Wayanad",
];


  export const inputFields = [
    { linkingName: "firstName", inputType: "text", inputName: "FIRST NAME" },
    { linkingName: "secondName", inputType: "text", inputName: "SECOND NAME" },
    {
      linkingName: "dateOfBirth",
      inputType: "date",
      inputName: "DATE OF BIRTH",
    },
    {
      linkingName: "state",
      inputType: "dropDown",
      option: districtsOfKerala,
      inputName: "DISTRICT THAT YOU LIVE",
    },
    {
      linkingName: "Gender",
      inputType: "dropDown",
      option: ["female", "male"],
      inputName: "YOUR GENDER",
    },
    {
      linkingName: "partner",
      inputType: "dropDown",
      option: ["male", "female"],
      inputName: "GENDER OF PARTNER",
    },
    { linkingName: "email", inputType: "email", inputName: "EMAIL" },
    { linkingName: "password", inputType: "password", inputName: "PASSWORD" },
    {
      linkingName: "cPassword",
      inputType: "password",
      inputName: "CONFIRM PASSWORD",
    },
  ];