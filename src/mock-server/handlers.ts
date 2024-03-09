import { http, HttpResponse } from 'msw';
import { Resource } from './types';
import {BASE_URL} from "./constants.ts";
import {sleep} from "./utils.ts";

const resources = [] as Resource[];

export const handlers = [
  http.get(`${BASE_URL}/resources`, () => HttpResponse.json(resources)),
  http.post(`${BASE_URL}/resources`, async ({ request }) => {
    const data = (await request.json()) as Resource & { shouldError?: boolean }

    await sleep(1000);

    if (data.shouldError) {
      return new Response(JSON.stringify({message: "There was a failure adding the image"}), {
        status: 500
      });
    }

    resources.push(data);
    return new Response(JSON.stringify(resources));
  }),
];
