import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const useFollow = () => {
    const queryClient = useQueryClient();
    const {mutate:follow, isPending} = useMutation({
        mutationFn: async (userId)=> {
            try {
                console.log("sfsdfsdf");
                const res = await   fetch(`/api/users/followAndUnfollowUser/${userId}`,
                    {
                        method: 'POST',
                        headers:
                        {
                            'Content-Type':'application/json'
                        }
                    }
                )
                const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
            } catch(e) {
                throw new Error(e);
            }
        },onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['SuggestedUsers'] }),
                queryClient.invalidateQueries({ queryKey: ['authUser'] })
            ]);
        }
        ,

        onError: (error)=> {
            toast.error(error.message);
        }
    });

    return {follow, isPending};
}

export default useFollow;