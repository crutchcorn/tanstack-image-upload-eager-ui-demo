import {FormEvent} from 'react';
import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {v4 as uuidv4} from "uuid";
import {Resource} from './mock-server/types';
import {BASE_URL} from "./mock-server/constants.ts";
import {toBase64} from "./utils.ts";
import {ErrorDisplay} from "./error-display.tsx";

export const App = () => {
  const queryClient = useQueryClient();

  const {
    isLoading,
    data: resources,
    error: resourceFetchError,
  } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/resources`, {
        method: 'GET',
      });
      if (!res.ok) {
        throw await res.json();
      }
      return (await res.json()) as Resource[];
    },
  });

  const {mutate: addToResources, variables, isPending, error: resourceAddError} = useMutation<
    unknown,
    DefaultError,
    Resource
  >({
    mutationKey: ['resource', 'add'],
    mutationFn: async (variables) => {
      const res = await fetch(`${BASE_URL}/resources`, {
        method: 'POST',
        body: JSON.stringify(variables),
      });
      if (!res.ok) {
        throw await res.json();
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({queryKey: ['resources']});
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const base64 = await toBase64(formData.get('file')! as File);
    const shouldError = formData.get('should_error') === 'on';
    addToResources({base64, id: uuidv4(), ...(shouldError ? {shouldError} : {})});
    form.reset();
  };

  const eagerResources = isPending
    ? [...(resources ?? []), variables]
    : resources ?? [];

  if (isLoading || !resources) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Resources</h1>
      <form onSubmit={onSubmit}
            style={{border: "2px dashed #b2b2b2", padding: "1rem", borderRadius: "1rem", display: "inline-block"}}>
        <div style={{marginBottom: "1rem"}}>
          <label>
            <div style={{marginBottom: "0.5rem"}}>Image to upload</div>
            <input type="file" name="file" accept="image/*"/>
          </label>
        </div>
        <div style={{marginBottom: "1rem"}}>
          <label>
            <div style={{marginBottom: "0.5rem"}}>Should this upload fail?</div>
            <input type="checkbox" name="should_error"/>
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      <ErrorDisplay error={resourceFetchError} message="Failed to fetch resources"/>
      <ErrorDisplay error={resourceAddError} message="Failed to add resource"/>
      {isPending && <p>Showing eager UI...</p>}
      <ul>
        {eagerResources.map((resource) => {
          return (
            <li
              key={resource.id}
              style={{
                height: '100px',
                width: '100px',
                backgroundImage: `url(${resource.base64})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
              }}
            />
          );
        })}
      </ul>
    </div>
  );
};
