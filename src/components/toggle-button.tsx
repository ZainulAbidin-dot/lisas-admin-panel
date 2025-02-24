import { cn } from '@/lib/utils';

const ToggleButton = ({
  isVerified,
  onChangeVerificationStatus,
  updating,
}: {
  isVerified: boolean;
  onChangeVerificationStatus: () => Promise<void>;
  updating: boolean;
}) => {
  return (
    <div className="flex items-center gap-2">
      <p className="font-semibold">Verification Status</p>
      <button
        className={cn(
          'relative h-8 w-16 rounded-full transition-colors duration-500 ease-in-out',
          isVerified ? 'bg-green-600' : 'bg-gray-600',
          updating ? 'cursor-not-allowed opacity-80' : ''
        )}
        disabled={updating}
        onClick={onChangeVerificationStatus}
      >
        <span
          className={cn(
            'absolute left-0 top-0 h-8 w-8 rounded-full border-none bg-white shadow-lg transition-transform duration-500 ease-in-out',
            isVerified ? 'translate-x-full' : 'translate-x-0'
          )}
        />
      </button>
      <span className="sr-only ml-2">
        {isVerified ? 'Verified' : 'Not Verified'}
      </span>
    </div>
  );
};

export default ToggleButton;
