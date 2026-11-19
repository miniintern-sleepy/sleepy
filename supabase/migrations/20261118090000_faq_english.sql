-- #98 영문 페이지(/en)에서 영문 FAQ를 보여 주려고 질문·답변 영문 열을 더한다.
-- 영문이 비어 있으면 화면은 한국어 원문을 대신 보여 준다(src/lib/content.ts getFaqs).
alter table public.faqs
  add column question_en text,
  add column answer_en text;

-- 2026-11-18 운영 DB에 있던 FAQ(id 6~26)의 영문 번역. 용어는 src/content/en과 맞춘다(binaural beats).
update public.faqs as f set question_en = v.q, answer_en = v.a
from (values
  (6, 'Do I only use SLEEBY before going to sleep?',
      'You can use it before bed at night, and also when you want a short nap or a rest during the day. Put it in both ears, then sleep or rest as usual. You can focus on the soft sound SLEEBY plays, or simply not pay attention to it.'),
  (7, 'Is it okay to keep wearing it after I fall asleep?',
      'Yes. The binaural beats turn off automatically about 30 minutes after power-on. If you fall asleep within 30 minutes, you can keep sleeping with it in. If it feels uncomfortable, take it out. Choose whichever feels more comfortable.'),
  (8, 'Can I take it out while using it?',
      'Yes. You can take it out at any time if it feels uncomfortable or you simply want to.'),
  (9, 'If I can''t fall asleep, can I put it back in?',
      'Yes. If you still can''t sleep or don''t feel drowsy after SLEEBY turns off automatically at 30 minutes, you can use it again. Put SLEEBY in the charging case, take it out after 1–2 seconds and wear it, and the binaural beats will play for another 30 minutes.'),
  (10, 'Can I use it for naps?',
      'Yes. You can use it for naps or whenever you rest. Wear it in a comfortable position.'),
  (11, 'Is it okay to use it every day?',
      'Yes. If it is comfortable to wear, you can use it repeatedly at night or during the day whenever you need. Responses to binaural beats vary from person to person, and so can the experience of using it.'),
  (12, 'What does the LED show when charging is complete?',
      'While the case is charging, the white LED blinks. When charging is complete, the white LED stays on.'),
  (13, 'Can I use SLEEBY while the charging case is charging?',
      'Yes. You can take SLEEBY out and use it while the charging case is charging.'),
  (14, 'Can SLEEBY charge while the charging case is charging?',
      'Yes. Put SLEEBY in the case and it will charge, whether or not a cable is connected to the case.'),
  (15, 'How do I replace the ear tips?',
      'Gently remove the ear tip from the SLEEBY body, then fit the ear tip of the size you want onto the body. Be careful not to pull or twist too hard.'),
  (16, 'How should I clean the SLEEBY body?',
      'SLEEBY is not waterproof. Rinsing it under running water or submerging it can damage it, so please avoid this. Wiping it with a cleaning solution or a wet wipe, as you would clean glasses, is fine.'),
  (17, 'How should I store it when not in use?',
      'When not in use, keep the earbuds in the charging case. Avoid humid or hot places.'),
  (18, 'Can I use it on a plane or train when traveling?',
      'Yes, you can. In noisy surroundings the binaural beats may be hard to hear, but you can still wear and use SLEEBY even if the sound isn''t clear. Avoid using it when you need to hear announcements or safety instructions.'),
  (19, 'I''m a light sleeper. Will I hear sounds around me?',
      'SLEEBY has no active noise cancellation and does not block outside sound completely. As with regular earplugs, you may hear surrounding sounds faintly. How much you hear depends on the fit and on the individual.'),
  (20, 'Can I use it while listening to music or audiobooks?',
      'SLEEBY does not connect to other devices to play music or audiobooks. Please use its built-in binaural beats on their own.'),
  (21, 'Can I wear it together with headphones or other earplugs?',
      'SLEEBY is not designed to be worn with other devices or earplugs. Wearing them together may be uncomfortable or keep the product from working as intended, so please wear it on its own.'),
  (22, 'My ears are different sizes. Can I use a different ear tip size on each side?',
      'Yes. If each ear fits a different size, you can use a separate ear tip for each ear. Just make sure to match the L/R marks on the SLEEBY body when wearing it.'),
  (23, 'My ears are small. Will it fit?',
      'Ear shape and size differ from person to person, so the fit can vary. Choose the size that fits your ears comfortably from the included S/M/L ear tips.'),
  (24, 'Is it uncomfortable to sleep on my side?',
      'Comfort can vary with ear shape and sleeping position. If it feels uncomfortable when lying on your side, adjust the fit or take it out for a while.'),
  (25, 'Can people with ear conditions or sensitive ears use it?',
      'If you have ear pain or an ear condition, or feel discomfort while wearing it, stop using it. If you are unsure whether it is right for you, please consult a medical professional.'),
  (26, 'What is included in the box?',
      'The box includes the SLEEBY earbuds, a charging case, a USB-C charging cable, S/M/L ear tips, and a user manual.')
) as v(id, q, a)
where f.id = v.id;
