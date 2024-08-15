const Input = (props) => {
  const handleChange = ({ target: { value } }) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return <input {...props} onChange={handleChange} />;
};

export default Input;
