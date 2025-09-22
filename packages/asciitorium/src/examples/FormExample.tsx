import {
  Text,
  State,
  Button,
  Row,
  Column,
  TextInput,
  GaugeSlider,
  Select,
  Line,
} from '../index';
import { BaseStyle } from './constants';

/** derive a State<T> from other states */
function computed<T>(sources: State<any>[], calc: () => T): State<T> {
  const out = new State<T>(calc());
  const resub = () => {
    out.value = calc();
  };
  sources.forEach((s) => s.subscribe(resub));
  return out;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const validateEmail = (email: string): ValidationResult => {
  if (email.trim() === '')
    return { isValid: false, error: 'Email is required' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return { isValid: false, error: 'Invalid email format' };
  return { isValid: true };
};

const validateAge = (age: number): ValidationResult => {
  if (isNaN(age) || age <= 0)
    return { isValid: false, error: 'Age must be a positive number' };
  if (age < 13)
    return { isValid: false, error: 'Must be at least 13 years old' };
  if (age > 120) return { isValid: false, error: 'Age must be realistic' };
  return { isValid: true };
};

const validateName = (name: string): ValidationResult => {
  if (name.trim() === '') return { isValid: false, error: 'Name is required' };
  if (name.trim().length < 2)
    return { isValid: false, error: 'Name must be at least 2 characters' };
  return { isValid: true };
};

export const FormExample = () => {
  // Style dictionary for reusable component styles
  const styles = {
    fieldLabel: {
      align: 'left' as const,
      width: 10,
    },
    inputField: {
      width: 32,
    },
    errorText: {
      align: 'center' as const,
      gap: { left: 1 },
    },
    formRow: {
      gap: { left: 1 },
    },
    formRowWithTopGap: {
      gap: { left: 1, top: 1 },
    },
    actionButton: {
      gap: { right: 1 },
    },
    statusContainer: {
      // No specific styles, but demonstrates empty style object
    },
    resultsDisplay: {
      border: true,
      width: 'fill' as const,
      height: 'fill' as const,
    },
  };

  // Form field states
  const name = new State('');
  const email = new State('');
  const age = new State(22);
  const country = new State('');

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
        `Country: ${countryLabel}`;
    } else {
      submissionResult.value =
        'Please fix validation errors before submitting.';
    }
  };

  const handleClear = () => {
    name.value = '';
    email.value = '';
    age.value = 0;
    country.value = '';
    nameError.value = '';
    emailError.value = '';
    ageError.value = '';
    submissionResult.value = '';
    isFormValid.value = false;
  };

  // UI
  return (
    <Column style={BaseStyle} label="Form Example">
      {/* Name */}
      <Row style={styles.formRowWithTopGap}>
        <Text style={styles.fieldLabel}>Name:</Text>
        <TextInput
          value={name}
          placeholder="Enter your full name"
          style={styles.inputField}
          onEnter={handleSubmit}
        />
        <Text style={styles.errorText}>{nameErrorDisplay}</Text>
      </Row>

      {/* Email */}
      <Row style={styles.formRow}>
        <Text style={styles.fieldLabel}>Email:</Text>
        <TextInput
          value={email}
          placeholder="your.email@example.com"
          style={styles.inputField}
          onEnter={handleSubmit}
        />
        <Text style={styles.errorText}>{emailErrorDisplay}</Text>
      </Row>

      {/* Age */}
      <Row style={styles.formRow}>
        <Text style={styles.fieldLabel}>Age:</Text>
        <GaugeSlider
          height={3}
          value={age}
          min={18}
          max={100}
          step={1}
          style={styles.inputField}
        />
        <Text gap={1} width={3}>
          {age}
        </Text>
        <Text style={styles.errorText}>{ageErrorDisplay}</Text>
      </Row>

      {/* Country */}
      <Row style={styles.formRow}>
        <Text style={styles.fieldLabel}>Country:</Text>
        <Select selectedItem={country} items={countryOptions} width={25} />
      </Row>

      {/* Actions */}
      <Row align="right">
        <Button onClick={handleSubmit} style={styles.actionButton} hotkey="e">
          Submit
        </Button>
        <Button onClick={handleClear} style={styles.actionButton} hotkey="c">
          Clear
        </Button>
      </Row>

      {/* Status */}
      <Line />
      <Row style={styles.statusContainer}>
        <Text>Form Status: </Text>
        <Text>{formStatusText}</Text>
      </Row>
      <Text align="center" gap={{ top: 1 }}>
        Press ` (backtick) to toggle hotkey display, Tab to navigate, or use hotkeys for quick access
      </Text>
      {/* Results */}
      <Text style={styles.resultsDisplay}>{submissionResult}</Text>
    </Column>
  );
};
