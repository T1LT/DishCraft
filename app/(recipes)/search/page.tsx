import { SearchInput } from "./input";

export default function SearchPage() {
  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex flex-col gap-8">
        <h1 className="font-bold text-3xl text-center">Search</h1>
        <SearchInput />
      </div>
    </div>
  );
}
