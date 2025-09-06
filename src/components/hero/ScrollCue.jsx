export default function ScrollCue({ className = "" }) {
    return (
        <div
  className={`flex flex-col items-center gap-1 opacity-90 select-none ${className}`}
  aria-hidden="true"
>
  <a href="#highlights"
    className="relative w-[22px] h-[22px] border-r-2 border-b-2 rotate-45
               transition-all duration-300 hover:border-orange-500
               cursor-pointer"
  />
</div>
    );
}