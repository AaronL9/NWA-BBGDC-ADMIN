import "./loader.css";

export default function Loader() {
  return (
    <div className="loader">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  );
}

export function SmallLoader() {
  return <div className="small-loader"></div>;
}

export function TinyLoader() {
  return <div className="tiny-loader"></div>;
}
