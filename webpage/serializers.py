""" 
Copyright 2016, 2017 UFPE - Universidade Federal de Pernambuco
 
Este arquivo é parte do programa Amadeus Sistema de Gestão de Aprendizagem, ou simplesmente Amadeus LMS
 
O Amadeus LMS é um software livre; você pode redistribui-lo e/ou modifica-lo dentro dos termos da Licença Pública Geral GNU como publicada pela Fundação do Software Livre (FSF); na versão 2 da Licença.
 
Este programa é distribuído na esperança que possa ser útil, mas SEM NENHUMA GARANTIA; sem uma garantia implícita de ADEQUAÇÃO a qualquer MERCADO ou APLICAÇÃO EM PARTICULAR. Veja a Licença Pública Geral GNU para maiores detalhes.
 
Você deve ter recebido uma cópia da Licença Pública Geral GNU, sob o título "LICENSE", junto com este programa, se não, escreva para a Fundação do Software Livre (FSF) Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA.
"""

import os
from django.conf import settings
from django.core.files import File
from rest_framework import serializers
from django.shortcuts import get_object_or_404

from subjects.serializers import TagSerializer
from topics.serializers import TopicSerializer
from pendencies.serializers import PendenciesSerializer
from students_group.serializers import StudentsGroupSerializer
from users.serializers import UserBackupSerializer

from subjects.models import Tag, Subject
from topics.models import Topic, Resource
from pendencies.models import Pendencies
from students_group.models import StudentsGroup
from log.models import Log
from users.models import User

from .models import Webpage

class SimpleWebpageSerializer(serializers.ModelSerializer):
	topic = TopicSerializer('get_subject')
	tags = TagSerializer(many = True)
	pendencies_resource = PendenciesSerializer(many = True)

	def get_subject(self, obj):
		subject = self.context.get("subject", None)

		return subject

	class Meta:
		model = Webpage
		exclude = ('students', 'groups',)

	def create(self, data):
		topic = data['topic']

		webpage = None

		if not topic["id"] is None:
			if "subject" in topic:
				r_exits = Resource.objects.filter(topic__subject = topic["subject"], name__unaccent__iexact = data["name"])
			else:
				r_exits = Resource.objects.filter(topic__subject__id = topic["subject_id"], name__unaccent__iexact = data["name"])

			if not r_exits.exists():
				if topic['id'] == "":
					topic_exist = Topic.objects.filter(subject = topic['subject'], name__unaccent__iexact = topic["name"])

					if topic_exist.exists():
						topic = topic_exist[0]
					else:
						topic = Topic.objects.create(name = topic['name'], subject = topic['subject'], repository = topic['repository'], visible = topic['visible'], order = topic['order'], description = topic['description'])
					
					data["topic"] = topic
				else:
					data["topic"] = get_object_or_404(Topic, id = topic["id"])

				webpage_data = data
				
				pendencies = webpage_data["pendencies_resource"]
				del webpage_data["pendencies_resource"]

				webpage = Webpage()
				webpage.name = webpage_data["name"]
				webpage.brief_description = webpage_data["brief_description"]
				webpage.show_window = webpage_data["show_window"]
				webpage.all_students = webpage_data["all_students"]
				webpage.visible = webpage_data["visible"]
				webpage.order = webpage_data["order"]
				webpage.topic = webpage_data["topic"]
				webpage.content = webpage_data["content"]

				webpage.save()

				tags = data["tags"]

				for tag in tags:
					if not tag["name"] == "":
						if tag["id"] == "":
							tag = Tag.objects.create(name = tag["name"])
						else:
							tag = get_object_or_404(Tag, id = tag["id"])

						webpage.tags.add(tag)

				resource = get_object_or_404(Resource, id = webpage.id)

				for pend in pendencies:
					Pendencies.objects.create(resource = resource, **pend)

		return webpage

	def update(self, instance, data):
		return instance

class CompleteWebpageSerializer(serializers.ModelSerializer):
	topic = TopicSerializer('get_subject')
	tags = TagSerializer(many = True)
	pendencies_resource = PendenciesSerializer(many = True)
	groups = StudentsGroupSerializer('get_files', many = True)
	students = UserBackupSerializer('get_files', many = True)

	def get_subject(self, obj):
		subject = self.context.get("subject", None)

		return subject

	def get_files(self, obj):
		files = self.context.get("files", None)

		return files

	class Meta:
		model = Webpage
		fields = '__all__'

	def create(self, data):
		topic = data['topic']

		webpage = None

		if not topic["id"] is None:
			if "subject" in topic:
				r_exits = Resource.objects.filter(topic__subject = topic["subject"], name__unaccent__iexact = data["name"])
			else:
				r_exits = Resource.objects.filter(topic__subject__id = topic["subject_id"], name__unaccent__iexact = data["name"])

			if not r_exits.exists():
				if topic['id'] == "":
					topic_exist = Topic.objects.filter(subject = topic['subject'], name__unaccent__iexact = topic["name"])

					if topic_exist.exists():
						topic = topic_exist[0]
					else:
						topic = Topic.objects.create(name = topic['name'], subject = topic['subject'], repository = topic['repository'], visible = topic['visible'], order = topic['order'], description = topic['description'])
					
					data["topic"] = topic
				else:
					data["topic"] = get_object_or_404(Topic, id = topic["id"])

				webpage_data = data
				
				pendencies = webpage_data["pendencies_resource"]
				del webpage_data["pendencies_resource"]

				webpage = Webpage()
				webpage.name = webpage_data["name"]
				webpage.brief_description = webpage_data["brief_description"]
				webpage.show_window = webpage_data["show_window"]
				webpage.all_students = webpage_data["all_students"]
				webpage.visible = webpage_data["visible"]
				webpage.order = webpage_data["order"]
				webpage.topic = webpage_data["topic"]
				webpage.content = webpage_data["content"]

				webpage.save()

				tags = data["tags"]

				for tag in tags:
					if not tag["name"] == "":
						if tag["id"] == "":
							tag = Tag.objects.create(name = tag["name"])
						else:
							tag = get_object_or_404(Tag, id = tag["id"])

						webpage.tags.add(tag)

				students = data["students"]
				subject = get_object_or_404(Subject, slug = self.context.get("subject", None))

				for student_data in students:
					logs = student_data["get_items"]
					
					if student_data["id"] == "":
						u_exist = User.objects.filter(email = student_data["email"])


						if not u_exist.exists():
							student = u_exist[0]

							for log in logs:
								log["user_id"] = student.id

								l_exists = Log.objects.filter(user_id = log["user_id"], user = log["user"], user_email = log["user_email"], action = log["action"], resource = log["resource"], component = log["component"], context = log["context"])

								if not l_exists.exists():
									Log.objects.create(**log)
						else:
							student = User()
							student.email = student_data["email"]
							student.username = student_data["username"]
							student.last_name = student_data["last_name"] 
							student.social_name = student_data["social_name"] 
							student.show_email = student_data["show_email"] 
							student.is_staff = student_data["is_staff"] 
							student.is_active = student_data["is_active"]
							student.image = student_data["image"]

							student.save()

							for log in logs:
								log["user_id"] = student.id

								Log.objects.create(**log)
					else:
						student = get_object_or_404(User, id = student_data["id"])

						for log in logs:
							l_exists = Log.objects.filter(user_id = log["user_id"], user = log["user"], user_email = log["user_email"], action = log["action"], resource = log["resource"], component = log["component"], context = log["context"])

							if not l_exists.exists():
								Log.objects.create(**log)

					webpage.students.add(student)
					subject.students.add(student)

				groups = data["groups"]

				for group_data in groups:
					g_exists = StudentsGroup.objects.filter(subject = subject, slug = group_data["slug"])

					if g_exists.exists():
						group = g_exists[0]
					else:
						group = StudentsGroup()
						group.name = group_data["name"]
						group.description = group_data["description"]
						group.subject = subject

						group.save()

						for participant in group_data["participants"]:
							p_user = get_object_or_404(User, email = participant["email"])

							group.participants.add(p_user)

					webpage.groups.add(group)

				resource = get_object_or_404(Resource, id = webpage.id)

				for pend in pendencies:
					Pendencies.objects.create(resource = resource, **pend)

		return webpage