import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { ButtonWithLoader } from '@/components/composed/button-with-loader';

export function ManageSubscription() {
  const { currentSubsState, fetchingBillingPortal, getBillingPortalUrl } =
    useManageSubscription();

  if (currentSubsState.isFetching) return <div>Loading...</div>;

  if (!currentSubsState.data) return <div>No Subscription</div>;

  const subscriptionActive = currentSubsState.data.active;
  const subscriptionPlan = currentSubsState.data.plan;

  const subscribedBadgeClass =
    'bg-gradient-to-tr from-[#000] to-[#999] text-white font-bold px-4 py-1 rounded-full w-full shadow-[-0px_-0px_20px_20px_rgba(255,255,255,1)] text-center';

  const upgradeBadgeClass =
    'bg-gradient-to-tr from-[#fa4737] to-orange-400 text-white font-bold px-4 py-1 rounded-full w-full shadow-[-0px_-0px_20px_20px_rgba(255,255,255,1)] text-center';

  return (
    <div className="flex flex-col justify-center items-center py-4 px-14">
      <p className="text-sm font-bold mt-6">Select a plan</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-center border border-orange-500 rounded-md my-4 p-4">
            <h3 className="text-xl font-bold mb-2">Monthly</h3>
            <p className="text-gray-700 mb-2">$12/m</p>
          </div>
          <div className="border rounded-lg bg-white shadow-md">
            <ul className="text-gray-600 p-6 text-sm">
              <li>✅ Unlimited likes</li>
              <li>✅ See who Likes You</li>
              <li>✅ Unlimited Rewinds</li>
              <li>✅ 1 free Boost per month</li>
              <li>✅ 5 free Super Likes per week</li>
              <li>✅ Passport - Match & chat worldwide</li>
            </ul>
            {subscriptionPlan === 'month' ? (
              subscriptionActive ? (
                <div className={subscribedBadgeClass}>Subscribed</div>
              ) : (
                <div className={upgradeBadgeClass}>Expired</div>
              )
            ) : (
              <div className={upgradeBadgeClass}>Update Plan</div>
            )}
            <ul className="text-gray-600 p-6 text-sm">
              <li>✅ 1 free Boost per month</li>
              <li>✅ 5 free Super Likes per week</li>
              <li>✅ Passport - Match & chat worldwide</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="text-center border-2 border-orange-500 rounded-md my-4 p-4">
            <h3 className="text-xl font-bold mb-2">Yearly (Save 30%)</h3>
            <p className="text-gray-700 mb-2">$99/Year</p>
          </div>
          <div className="border rounded-lg bg-white shadow-md">
            <ul className="text-gray-600 p-6 text-sm">
              <li>✅ Unlimited likes</li>
              <li>✅ See who Likes You</li>
              <li>✅ Unlimited Rewinds</li>
              <li>✅ 1 free Boost per month</li>
              <li>✅ 5 free Super Likes per week</li>
              <li>✅ Passport - Match & chat worldwide</li>
            </ul>
            {subscriptionPlan === 'year' ? (
              subscriptionActive ? (
                <div className={subscribedBadgeClass}>Subscribed</div>
              ) : (
                <div className={upgradeBadgeClass}>Expired</div>
              )
            ) : (
              <div className={upgradeBadgeClass}>Update Plan</div>
            )}
            <ul className="text-gray-600 p-6 text-sm">
              <li>✅ 1 free Boost per month</li>
              <li>✅ 5 free Super Likes per week</li>
              <li>✅ Passport - Match & chat worldwide</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <ButtonWithLoader
          variant="gradient"
          isLoading={fetchingBillingPortal}
          loadingText="Loading..."
          initialText="Manage Billing"
          disabled={fetchingBillingPortal}
          onClick={getBillingPortalUrl}
        >
          Manage Billing
        </ButtonWithLoader>
      </div>
    </div>
  );
}

type CurrentSubscription = {
  active: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  plan: 'month' | 'year';
};

function useManageSubscription() {
  const axiosPrivate = useAxiosPrivate();

  const [currentSubsState, setCurrentSubsState] = useState<{
    isFetching: boolean;
    data: CurrentSubscription | null;
  }>({
    isFetching: false,
    data: null,
  });

  const [fetchingBillingPortal, setFetchingBillingPortal] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    setCurrentSubsState((prev) => ({
      ...prev,
      isFetching: true,
    }));
    axiosPrivate
      .get('/stripe/get-subscription', {
        signal: abortController.signal,
      })
      .then((response) => {
        console.log(response.data);
        setCurrentSubsState((prev) => ({
          ...prev,
          data: response.data.data.subscription,
          isFetching: false,
        }));
      })
      .catch((error) => {
        if (error instanceof Error) {
          if (error.name !== 'CanceledError') {
            console.log(error);
            const errorMessage =
              error instanceof AxiosError
                ? error?.response?.data?.message ||
                  error?.message ||
                  'Unknown Error'
                : 'Unknown Error';
            toast.error(errorMessage);
            setCurrentSubsState((prev) => ({
              ...prev,
              isFetching: false,
            }));
          }
        } else {
          console.log('Error: ', error);
          setCurrentSubsState((prev) => ({
            ...prev,
            isFetching: false,
          }));
        }
      });
  }, [axiosPrivate]);

  const getBillingPortalUrl = async () => {
    try {
      setFetchingBillingPortal(true);
      const response = await axiosPrivate.get('/stripe/billing-portal');
      setFetchingBillingPortal(false);

      window.open(response.data.data.url, '_blank');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'CanceledError') {
          console.log(error);
          const errorMessage =
            error instanceof AxiosError
              ? error?.response?.data?.message ||
                error?.message ||
                'Unknown Error'
              : 'Unknown Error';
          toast.error(errorMessage);
          setFetchingBillingPortal(false);
        }
      } else {
        console.log('Error: ', error);
        setFetchingBillingPortal(false);
      }
    }
  };

  return {
    currentSubsState,
    getBillingPortalUrl,
    fetchingBillingPortal,
  };
}
