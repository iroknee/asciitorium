import {
  Text,
  State,
  Button,
  Component,
  Row,
  Column,
  TextInput,
  Select,
} from '../index';

/** derive a State<T> from other states */
function computed<T>(sources: State<any>[], calc: () => T): State<T> {
  const out = new State<T>(calc());
  const resub = () => { out.value = calc(); };
  sources.forEach(s => s.subscribe(resub));
  return out;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const validateEmail = (email: string): ValidationResult => {
  if (email.trim() === '') return { isValid: false, error: 'Email is required' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { isValid: false, error: 'Invalid email format' };
  return { isValid: true };
};

const validateAge = (age: number): ValidationResult => {
  if (isNaN(age) || age <= 0) return { isValid: false, error: 'Age must be a positive number' };
  if (age < 13) return { isValid: false, error: 'Must be at least 13 years old' };
  if (age > 120) return { isValid: false, error: 'Age must be realistic' };
  return { isValid: true };
};

const validateName = (name: string): ValidationResult => {
  if (name.trim() === '') return { isValid: false, error: 'Name is required' };
  if (name.trim().length < 2) return { isValid: false, error: 'Name must be at least 2 characters' };
  return { isValid: true };
};

export const FormExample = () => {
  // Form field states
  const name = new State('');
  const email = new State('');
  const age = new State(0);
  const country = new State('');
  const interests = new State('');

  // Validation error states
  const nameError = new State('');
  const emailError = new State('');
  const ageError = new State('');

  // Submission + validity
  const submissionResult = new State('');
  const isFormValid = new State(false);

  const countryOptions = [
    'Select Country',
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'Australia',
  ];

  // Real-time validators
  const validateNameField = () => {
    const r = validateName(name.value);
    nameError.value = r.error || '';
    updateFormValidity();
  };
  const validateEmailField = () => {
    const r = validateEmail(email.value);
    emailError.value = r.error || '';
    updateFormValidity();
  };
  const validateAgeField = () => {
    const r = validateAge(age.value);
    ageError.value = r.error || '';
    updateFormValidity();
  };
  const updateFormValidity = () => {
    isFormValid.value =
      validateName(name.value).isValid &&
      validateEmail(email.value).isValid &&
      validateAge(age.value).isValid;
  };

  // Subscribe for live validation
  name.subscribe(validateNameField);
  email.subscribe(validateEmailField);
  age.subscribe(validateAgeField);

  // Derived display states (no inline conditionals)
  const nameErrorDisplay = computed([nameError], () =>
    nameError.value ? `⚠ ${nameError.value}` : ''
  );
  const emailErrorDisplay = computed([emailError], () =>
    emailError.value ? `⚠ ${emailError.value}` : ''
  );
  const ageErrorDisplay = computed([ageError], () =>
    ageError.value ? `⚠ ${ageError.value}` : ''
  );
  const formStatusText = computed([isFormValid], () =>
    isFormValid.value ? '✓ Valid' : '✗ Invalid'
  );

  // Handlers
  const handleSubmit = () => {
    validateNameField();
    validateEmailField();
    validateAgeField();

    if (isFormValid.value) {
      const countryLabel = country.value || 'Not specified';
      submissionResult.value =
        `Form Submitted Successfully!\n` +
        `Name: ${name.value}, ` +
        `Email: ${email.value}\n` +
        `Age: ${age.value}, ` +
        `Country: ${countryLabel}\n` +
        `Interests: ${interests.value || 'None specified'}`;
    } else {
      submissionResult.value = 'Please fix validation errors before submitting.';
    }
  };

  const handleClear = () => {
    name.value = '';
    email.value = '';
    age.value = 0;
    country.value = '';
    interests.value = '';
    nameError.value = '';
    emailError.value = '';
    ageError.value = '';
    submissionResult.value = '';
    isFormValid.value = false;
  };

  // UI
  return (
    <Column label="Form Example:" border>
        {/* Name */}
        <Row width="80%" height={3} gap={{left: 1, top: 1}}>
          <Text align="left" width={10}>Name:</Text>
          <TextInput
            value={name}
            placeholder="Enter your full name"
            width={32}
            onEnter={handleSubmit}
          />
          <Text align="right">{nameErrorDisplay}</Text>
        </Row>

        {/* Email */}
        <Row width="80%" height={3} gap={{left: 1, top: 1}}>
          <Text align="left" width={10}>Email:</Text>
          <TextInput
            value={email}
            placeholder="your.email@example.com"
            width={32}
            onEnter={handleSubmit}
          />
          <Text align="right">{emailErrorDisplay}</Text>
        </Row>

        {/* Age */}
        <Row width="80%" height={3} gap={{left: 1, top: 1}}>
          <Text align="left" width={10}>Age:</Text>
          <TextInput
            value={age}
            placeholder="25"
            width={10}
            numeric={true}
            onEnter={handleSubmit}
          />
          <Text align="right">{ageErrorDisplay}</Text>
        </Row>

        {/* Country */}
        <Row width="80%" height={3} gap={{left: 1, top: 1}}>
          <Text align="left" width={10}>Country:</Text>
          <Select selectedItem={country} items={countryOptions} width={25} />
        </Row>

        {/* Interests */}
        <Row width="80%" height={3} gap={{left: 1, top: 1}}>
          <Text align="left">Interests (Optional):</Text>
          <TextInput
            value={interests}
            placeholder="What are you interested in?"
            width={40}
            onEnter={handleSubmit}
          />
        </Row>

        {/* Actions */}
        <Row gap={{ top: 1 }} width="35%" align="right" height={4}>
          <Button content="Submit" onClick={handleSubmit} gap={{ right: 1 }} />
          <Button content="Clear" onClick={handleClear} />
        </Row>

        {/* Status */}
        <Row gap={{ top: 1 }}>
          <Text>Form Status: </Text>
          <Text>{formStatusText}</Text>
        </Row>

        {/* Result (always mounted; prints empty string until submit) */}
        <Text label="Results:" border width="100%" height={6} gap={{ top: 1 }}>{submissionResult}</Text>

    </Column>
  );
};