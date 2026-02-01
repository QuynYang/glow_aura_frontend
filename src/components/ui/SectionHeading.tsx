export const SectionHeading = ({ title }: { title: string }) => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-bold mb-2">
        {title}
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto opacity-50"></div>
    </div>
  );
};