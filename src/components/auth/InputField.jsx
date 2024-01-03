import PropTypes from 'prop-types'

export default function InputField({ variation, setValue, value }) {

  return (
    <div className="input-field">
      <input
        id={variation.id}
        type={variation.type}
        placeholder={variation.placeholder}
        required
        autoComplete="true"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <img src={variation.icon} />
    </div>
  );
}

InputField.propTypes = {
  variation: PropTypes.object,
  setValue: PropTypes.func,
  value: PropTypes.string,
}