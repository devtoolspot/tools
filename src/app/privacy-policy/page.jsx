"use client";

import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Information We Collect</h2>
                    <p>
                        We prioritize your privacy. Most of our tools operate entirely client-side (in your browser), meaning your data (images, code, text) is processed on your device and is never sent to our servers.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Local Storage</h2>
                    <p>
                        We may use browser local storage to save your preferences (such as theme choice) or temporary data to improve your experience. This data stays on your device.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Third-Party Services</h2>
                    <p>
                        We use standard analytics tools to improve our website performance. These tools may collect anonymous usage data.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Changes to This Policy</h2>
                    <p>
                        We may update this privacy policy from time to time. We encourage users to check this page for any changes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us.
                    </p>
                </section>

                <div className="pt-8 text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
