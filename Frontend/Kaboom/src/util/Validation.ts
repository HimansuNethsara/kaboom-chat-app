export const validateFirstName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "First name is required!";
  }
  return null;
};

export const validateLastName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "Last name is required!";
  }
  return null;
};

export const validateCountryCode = (countryCode: string): string | null => {
  const regex = /^\+[1-9]\d{0,3}$/;
  if (!countryCode) {
    return "Country code is required";
  }
  if (!regex.test(countryCode)) {
    return "Enter a valid country code";
  }
  return null;
};

export const validatePhoneNo = (phoneNo: string): string | null => {
  const regex = /^[1-9][0-9]{6,14}$/;
  if (!phoneNo) {
    return "Contact number is require!";
  }
  if (!regex.test(phoneNo)) {
    return "Enter a valid contact number";
  }
  return null;
};

export const validateProfileImage = (imageUri: string | null): string | null => {
  if (!imageUri || imageUri.trim().length === 0) {
    return "Profile image is required!";
  }
  return null;
};

