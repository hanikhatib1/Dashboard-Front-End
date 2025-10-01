const conditions = [
  {
    label: "At least 6 characters",
    test: (pw) => pw.length >= 6,
  },
  {
    label: "One uppercase letter (A–Z)",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    label: "One lowercase letter (a–z)",
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    label: "One number (0–9)",
    test: (pw) => /[0-9]/.test(pw),
  },
  {
    label: "One special character (!@#$%^&*)",
    test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
];

const PasswordStrength = ({ password }) => {
  return (
    <div className="mt-2 p-3 rounded-md border bg-gray-50">
      <p className="font-semibold text-gray-700 mb-2">Password must include:</p>
      <ul className="space-y-1">
        {conditions.map((cond, index) => {
          const passed = cond.test(password);
          return (
            <li
              key={index}
              className={`flex items-center gap-2 text-sm ${
                passed ? "text-green-600" : "text-red-500"
              }`}
            >
              <span>{passed ? "✅" : "❌"}</span>
              {cond.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrength;
