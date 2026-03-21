export default function SearchBar({ value, onChange }) {
  return (
    <div className='relative mb-4'>
      <input 
        type='text' 
        placeholder='Search listings...'
        className='w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:border-primary'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <svg className='w-5 h-5 absolute left-3 top-3.5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
      </svg>
    </div>
  );
}
