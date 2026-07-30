function Toggle({ name, value, onChange, iconOn, iconOff }) {
  return (
    <button
      type="button"
      className={`stateButton ${value ? "on" : "off"}`}
      onClick={() => onChange(name)}
    >
      <span className={`icon ${value}`}>{value ? iconOn : iconOff}</span>
    </button>
  );
}

export default Toggle;
