export default function Showcase({ path }) {
    return (
      <div className="w-full h-60 rounded-md overflow-hidden mb-4">
        <img
          src={path}
          alt="Showcase"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  