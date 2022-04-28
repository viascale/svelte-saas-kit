<script lang="ts">
  import { Link } from "svelte-routing";

  export let className: string;

  import { _ as t } from "svelte-i18n";
</script>

<div class={className}>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
    <div>
      <h2 class="text-base font-semibold text-theme-600 uppercase tracking-wide">{$t("front.features.frontend.hint")}</h2>
      <p class="mt-2 text-3xl font-extrabold">{$t("front.features.frontend.title")}</p>
      <p class="mt-4 text-lg text-gray-500">{$t("front.features.frontend.headline")}</p>
    </div>
    <div class="mt-12 lg:mt-0 lg:col-span-2">
      <dl class="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:grid-rows-4 sm:grid-flow-col sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.frontend.components.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Components"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/Components.jpg"
            />
            <div>
              {$t("front.features.frontend.components.description")}{" "}
              <a href="https://saasfrontends.com/components" class="underline text-theme-500 font-medium">
                {$t("front.features.frontend.components.viewAll")}
              </a>
            </div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.frontend.routes.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Router"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/Router.jpg"
            />
            <div>
              {$t("front.features.frontend.routes.front")}
              <span class="italic text-xs">{$t("front.features.frontend.routes.frontPages")}</span>, {$t("front.features.frontend.routes.account")}
              <span class="italic text-xs">{$t("front.features.frontend.routes.accountPages")}</span>, {$t("front.features.frontend.routes.admin")}
              <span class="italic text-xs">{$t("front.features.frontend.routes.adminPages")}</span>, {$t("front.features.frontend.routes.core")}
              <span class="italic text-xs">{$t("front.features.frontend.routes.corePages")}</span>
              {$t("front.features.frontend.routes.app")}
              <span class="italic text-xs">{$t("front.features.frontend.routes.appPages")}</span>
              {$t("front.features.frontend.routes.views")}{" "}
              <a href="https://saasfrontends.com/docs/pages" class="underline text-theme-500 font-medium">
                {$t("front.features.frontend.routes.viewAll")}
              </a>
            </div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.frontend.i18n.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="i18n"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/i18n.jpg"
            />
            <div>
              {$t("front.features.frontend.i18n.description")} <strong>i18n-ally</strong>.
            </div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.frontend.store.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Store"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/Store.jpg"
            />
            <div>{$t("front.features.frontend.store.description")}</div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.frontend.tailwindcss.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Tailwind CSS"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/Tailwind%20CSS.jpg"
            />
            <div>
              {$t("front.features.frontend.tailwindcss.description")}
              <strong>Dark Mode</strong>.
            </div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.frontend.classComponents.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="svelte-components"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/svelte-components.jpg"
            />
            <div>{$t("front.features.frontend.classComponents.description")}</div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.frontend.fakeApi.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Fake API"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/Fake%20API.jpg"
            />
            <div>{$t("front.features.frontend.fakeApi.description")}</div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.frontend.eslint.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Svelte Check"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/svelte-check.jpg"
            />
            <div>
              {$t("front.features.frontend.eslint.description")}{" "}.
            </div>
          </dd>
        </div>
      </dl>
    </div>
  </div>

  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
    <div>
      <h2 class="text-base font-semibold text-theme-600 uppercase tracking-wide">{$t("front.features.backend.hint")}</h2>
      <p class="mt-2 text-3xl font-extrabold">{$t("front.features.backend.title")}</p>
      <p class="mt-4 text-lg text-gray-500">{$t("front.features.backend.description")}</p>
    </div>
    <div class="mt-12 lg:mt-0 lg:col-span-2">
      <dl class="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:grid-rows-4 sm:grid-flow-col sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.backend.features.net.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt=".NET"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/_NET.jpg"
            />
            <div>{$t("front.features.backend.features.net.description")}</div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.backend.features.cleanArchitecture.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Clean Architecture"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/CleanArchitecture.jpg"
            />
            <div>{$t("front.features.backend.features.cleanArchitecture.description")}</div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.backend.features.tests.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Tests"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/Tests.jpg"
            />
            <div>{$t("front.features.backend.features.tests.description")}</div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.backend.features.multiTenant.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Multi-Tenancy"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/MultiTenancy.jpg"
            />
            <div>{$t("front.features.backend.features.multiTenant.description")}</div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.backend.features.memberManagement.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Components"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/MemberManagement.jpg"
            />
            <div>{$t("front.features.backend.features.memberManagement.description")}</div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.backend.features.stripe.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Components"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/Stripe.jpg"
            />
            <div>
              {$t("front.features.backend.features.stripe.description")}{" "}
              <Link to="/admin/pricing" class="underline text-theme-500 font-medium">
                {$t("front.features.backend.features.stripe.setup")}
              </Link>
            </div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.backend.features.postmark.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Components"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/Postmark.jpg"
            />
            <div>
              {$t("front.features.backend.features.postmark.description")}{" "}
              <Link to="/admin/emails" class="underline text-theme-500 font-medium">
                {$t("front.features.backend.features.postmark.setup")}
              </Link>
            </div>
          </dd>
        </div>

        <div class="relative">
          <dt>
            <!-- Heroicon name: outline/check -->
            <svg
              class="absolute h-6 w-6 text-theme-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-9 text-lg leading-6 font-medium">{$t("front.features.backend.features.ef.title")}</p>
          </dt>
          <dd class="mt-2 ml-9 text-base text-gray-500 space-y-3">
            <img
              alt="Components"
              class="w-full h-20 shadow-lg border border-gray-200 dark:border-slate-800 rounded-md object-cover"
              src="https://yahooder.sirv.com/saasfrontends/features/EntityFramework.jpg"
            />
            <div>{$t("front.features.backend.features.ef.description")}</div>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</div>
