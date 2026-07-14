import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { medicalBusiness, person, website } from '../../core/schema';
import { CLINICIAN, CONTACT, FEES, GROUPS } from '../../core/practice.config';
import { SERVICE_LINKS } from '../../core/navigation';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CtaBanner],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  protected readonly clinician = CLINICIAN;
  protected readonly contact = CONTACT;
  protected readonly fees = FEES;
  protected readonly groups = GROUPS;
  protected readonly services = SERVICE_LINKS;

  protected readonly steps = [
    {
      n: 1,
      title: 'Reach out',
      body: 'Send a message or email. We’ll find a time for a brief, no-pressure conversation about what’s bringing you in.',
    },
    {
      n: 2,
      title: 'Begin together',
      body: 'In your first session we’ll talk through your goals at your pace. Faith is invited only if and when you want it.',
    },
    {
      n: 3,
      title: 'Find your footing',
      body: 'With evidence-based, compassionate care, we work toward clarity, healing, and lasting change — securely online.',
    },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Christian Therapy Online in Illinois | Mason Kelly, LCSW',
        description:
          'Faith-centered, Bible-based therapy with Mason L. Kelly, LCSW. Telehealth across Illinois for trauma, addiction, anxiety, relationships & detransition support.',
        path: '/',
      },
      [medicalBusiness(), website(), person()],
    );
  }
}
